import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import '../style.less';

const TrongCTDT = (props: {
	data: {
		danhSachHocPhanCtdt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
		danhSachHocPhanDungTienTrinh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	};
}) => {
	const { data } = props;
	const { selectedIds, setSelectedIds } = useModel('hocphan.hocphan');
	const { record: recDot } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

	const statusOrder = {
		[ETrangThaiHocTap.CHUA_HOC]: 1,
		[ETrangThaiHocTap.DANG_HOC]: 2,
		[ETrangThaiHocTap.CHUA_DAT]: 3,
		[ETrangThaiHocTap.DA_HOC]: 4,
	};

	const danhSachHocPhanDungTienTrinhSorted = _.orderBy(
		data?.danhSachHocPhanDungTienTrinh ?? [],
		[(item) => statusOrder[item.hoc], (item) => item.maHocPhan],
		['asc', 'asc'],
	);

	const danhSachHocPhanCtdtSorted = _.orderBy(
		data?.danhSachHocPhanCtdt ?? [],
		[(item) => statusOrder[item.hoc], (item) => item.maHocPhan],
		['asc', 'asc'],
	);

	const datas = [
		...danhSachHocPhanDungTienTrinhSorted,
		...danhSachHocPhanCtdtSorted.filter(
			(itemCtdt) => !data?.danhSachHocPhanDungTienTrinh?.some((itemDungTien) => itemDungTien._id === itemCtdt._id),
		),
	];

	// Xác định các hàng cần mở rộng
	useEffect(() => {
		const defaultExpandedKeys = (data?.danhSachHocPhanCtdt ?? [])
			.filter(
				(item) =>
					item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON &&
					item.hocPhanCtdtList?.length &&
					item.hocPhanCtdtList?.length > 0,
			)
			.map((item) => item.maHocPhan);
		setExpandedRowKeys(defaultExpandedKeys);
	}, [data]);

	const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên HP',
			width: 200,
			render: (val, rec) => rec?.hocPhan?.ten ?? rec?.ten,
			filterType: 'string',
		},
		{
			title: 'Số tín chỉ',
			align: 'center',
			width: 90,
			filterType: 'number',
			render: (val, rec) => rec?.hocPhan?.soTinChi ?? rec?.soTinChiTuChonPhaiHoc,
			sortable: true,
		},
		{
			title: 'STT kỳ',
			dataIndex: 'soThuTuKy',
			align: 'center',
			width: 90,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Loại',
			dataIndex: 'loai' as any,
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Trạng thái học tập',
			dataIndex: 'hoc',
			align: 'center',
			width: 120,
			render: (val, rec) => trangThaiHocTap[rec?.hoc],
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={datas}
			addStt
			hasTotal
			size='small'
			otherProps={{
				scroll: { y: 500 },
				pagination: false,
				rowKey: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => rec.maHocPhan,
				rowClassName: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
					const isDungTienTrinh = data?.danhSachHocPhanDungTienTrinh?.some(
						(itemDungTien) => itemDungTien.maHocPhan === rec.maHocPhan,
					);
					const isDaHoc = rec.hoc === ETrangThaiHocTap.DA_HOC;

					let classNames = '';
					if (isDaHoc) {
						classNames = 'gray-row';
					}
					if (isDungTienTrinh) {
						classNames += classNames ? ' fw500' : 'fw500';
					}
					return classNames;
				},

				rowSelection: {
					type: 'checkbox',
					selectedRowKeys: selectedIds,
					preserveSelectedRowKeys: true,
					onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
					getCheckboxProps: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
						if (!rec || !rec.maHocPhan) {
							return { disabled: true };
						}

						const isDungTienTrinh = data?.danhSachHocPhanDungTienTrinh?.some(
							(item) => item.maHocPhan === rec.maHocPhan,
						);
						const isNgoaiLimit =
							(selectedIds ?? []).filter(
								(id) => !data?.danhSachHocPhanDungTienTrinh?.some((item) => item.maHocPhan === id),
							).length >= (recDot?.soHocPhanDangKyNgoaiTienTrinh ?? 0);

						const isSelected = selectedIds?.includes(rec.maHocPhan);
						return {
							disabled: !isSelected && !isDungTienTrinh && isNgoaiLimit,
						};
					},
					columnWidth: 40,
					hideSelectAll: true,
				},

				expandable: {
					expandRowByClick: true,
					indentSize: 0,
					expandedRowKeys: expandedRowKeys,
					onExpand: (expanded: any, record: any) => {
						setExpandedRowKeys((prev: any) =>
							expanded ? [...prev, record.maHocPhan] : prev.filter((key: any) => key !== record.maHocPhan),
						);
					},
					expandedRowRender: (record: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
						if (record.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && record.hocPhanCtdtList?.length) {
							return (
								<TableStaticData
									columns={columns}
									data={record.hocPhanCtdtList}
									size='small'
									otherProps={{
										pagination: true,
										rowKey: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => rec.maHocPhan,
										rowSelection: {
											type: 'checkbox',
											selectedRowKeys: selectedIds,
											preserveSelectedRowKeys: true,
											onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
											getCheckboxProps: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
												const isDungTienTrinh = data?.danhSachHocPhanDungTienTrinh?.some(
													(item) => item.maHocPhan === rec.maHocPhan,
												);
												const isNgoaiLimit =
													(selectedIds ?? []).filter(
														(id) => !data?.danhSachHocPhanDungTienTrinh?.some((item) => item.maHocPhan === id),
													).length >= (recDot?.soHocPhanDangKyNgoaiTienTrinh ?? 0);

												const isSelected = selectedIds?.includes(rec.maHocPhan);
												return {
													disabled: !isSelected && !isDungTienTrinh && isNgoaiLimit,
												};
											},
											columnWidth: 40,
											hideSelectAll: true,
										},
									}}
								/>
							);
						}
						return null;
					},
					rowExpandable: (record: any) =>
						record.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && record.hocPhanCtdtList?.length > 0,
					columnWidth: 40,
				},
			}}
		/>
	);
};

export default TrongCTDT;
