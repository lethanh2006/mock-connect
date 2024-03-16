import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { useModel } from 'umi';

const NoiDungHocPhanPage = () => {
	const { page, limit } = useModel('hocphan.noidunghp');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const columns: IColumn<HocPhan.ILichTrinhChung>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Hình thức tổ chức dạy học',
			width: 320,
			children: [
				{
					title: 'Lý thuyết',
					dataIndex: 'gioLyThuyet',
					width: 80,
					align: 'center',
				},
				{
					title: 'BT-TL',
					dataIndex: 'gioBaiTapTL',
					width: 80,
					align: 'center',
				},
				{
					title: 'Thực hành',
					dataIndex: 'gioThucHanh',
					width: 80,
					align: 'center',
				},
				{
					title: 'Tự học',
					dataIndex: 'gioTuHoc',
					width: 80,
					align: 'center',
				},
			],
		},
		{
			title: 'Tổng',
			width: 80,
			align: 'center',
			render: (val, rec) => rec.gioLyThuyet + rec.gioBaiTapTL + rec.gioThucHanh + rec.gioTuHoc,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ deCuongHpId: recDeCuong?._id }}
				dependencies={[page, limit, recDeCuong?._id]}
				modelName='hocphan.noidunghp'
				title='Nội dung học phần'
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default NoiDungHocPhanPage;
