import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { useModel } from 'umi';

const NgoaiCTDT = (props: {
	data: HocPhan.IRecord[];
	danhSachTrong: {
		danhSachHocPhanCtdt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
		danhSachHocPhanDungTienTrinh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	};
}) => {
	const { data, danhSachTrong } = props;
	const { selectedIds, setSelectedIds } = useModel('hocphan.hocphan');
	const { record: recDot } = useModel('sinhvien.nhucauhocphan.dotdangky');

	const columns: IColumn<HocPhan.IRecord>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'ma',
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên HP',
			dataIndex: 'ten',
			width: 200,

			filterType: 'string',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			align: 'center',
			width: 90,
			filterType: 'number',

			sortable: true,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={data}
			addStt
			hasTotal
			size='small'
			otherProps={{
				pagination: true,
				rowKey: (rec: HocPhan.IRecord) => rec.ma,
				rowSelection: {
					type: 'checkbox',
					selectedRowKeys: selectedIds,
					preserveSelectedRowKeys: true,
					onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
					getCheckboxProps: (rec: HocPhan.IRecord) => {
						const isDungTienTrinh = danhSachTrong?.danhSachHocPhanDungTienTrinh?.some(
							(itemDungTien) => itemDungTien.maHocPhan === rec.ma,
						);

						const isNgoaiLimit =
							(selectedIds ?? []).filter(
								(id) =>
									!danhSachTrong?.danhSachHocPhanDungTienTrinh?.some((itemDungTien) => itemDungTien.maHocPhan === id),
							).length >= (recDot?.soHocPhanDangKyNgoaiTienTrinh ?? 0);

						const isSelected = selectedIds?.includes(rec.ma);

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
};

export default NgoaiCTDT;
