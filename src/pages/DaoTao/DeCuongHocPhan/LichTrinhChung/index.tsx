import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { decodeHtmlEntities, removeHtmlTags } from '@/utils/utils';
import { useModel } from 'umi';
import ViewLichTrinhDeCuong from './View';

const NoiDungHocPhanPage = () => {
	const { page, limit, handleView } = useModel('hocphan.noidunghp');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const onCell = (rec: HocPhan.ILichTrinhChung) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<HocPhan.ILichTrinhChung>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 250,
			render: (val) =>
				val && <ExpandText ellipsis={{ expandable: false }}>{decodeHtmlEntities(removeHtmlTags(val))}</ExpandText>,
			onCell,
		},
		{
			title: 'Hình thức tổ chức dạy học',
			width: 400,
			children: [
				{
					title: 'Lý thuyết',
					dataIndex: 'gioLyThuyet',
					width: 80,
					align: 'center',
					onCell,
				},
				{
					title: 'BT-TL',
					dataIndex: 'gioBaiTapTL',
					width: 80,
					align: 'center',
					onCell,
				},
				{
					title: 'Thực hành',
					dataIndex: 'gioThucHanh',
					width: 80,
					align: 'center',
					onCell,
				},
				{
					title: 'Tự học',
					dataIndex: 'gioTuHoc',
					width: 80,
					align: 'center',
					onCell,
				},
				{
					title: 'Tổng',
					width: 80,
					align: 'center',
					render: (val, rec) => rec.gioLyThuyet + rec.gioBaiTapTL + rec.gioThucHanh + rec.gioTuHoc,
					onCell,
				},
			],
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
				Form={ViewLichTrinhDeCuong}
				widthDrawer={800}
				hideCard
				buttons={{ create: false }}
				maskCloseableForm
			/>
		</>
	);
};

export default NoiDungHocPhanPage;
