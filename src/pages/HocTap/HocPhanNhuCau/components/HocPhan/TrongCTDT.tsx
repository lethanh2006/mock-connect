import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import _ from 'lodash';
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

	const datas = [
		...(data?.danhSachHocPhanDungTienTrinh ?? []),
		...(data?.danhSachHocPhanCtdt ?? []).filter(
			(itemCtdt) => !data?.danhSachHocPhanDungTienTrinh?.some((itemDungTien) => itemDungTien._id === itemCtdt._id),
		),
	];

	const sortedData = datas.sort((a, b) => {
		const statusOrder = {
			[ETrangThaiHocTap.CHUA_HOC]: 1,
			[ETrangThaiHocTap.DANG_HOC]: 2,
			[ETrangThaiHocTap.DA_HOC]: 3,
			[ETrangThaiHocTap.CHUA_DAT]: 4,
		};
		return statusOrder[a.hoc] - statusOrder[b.hoc];
	});

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
			render: (val, rec) => rec?.hocPhan?.soTinChi ?? _.sumBy(rec?.hocPhanCtdtList, 'soTinChi'),
			sortable: true,
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
			data={sortedData}
			addStt
			hasTotal
			size='small'
			otherProps={{
				scroll: { y: 500 },
				pagination: false,
				rowKey: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => rec.maHocPhan ?? rec._id, // Sử dụng _id cho học phần tự chọn
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
					expandedRowRender: (record: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
						if (record.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && record.hocPhanCtdtList?.length) {
							return (
								<TableStaticData
									columns={columns}
									data={record.hocPhanCtdtList}
									size='small'
									otherProps={{
										pagination: true,
										rowKey: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => rec.maHocPhan ?? rec._id,
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
