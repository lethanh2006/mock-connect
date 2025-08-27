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
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 180,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Giai đoạn',
			dataIndex: 'giaiDoanDayHoc',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời lượng (tiết)',
			width: 300,
			children: [
				{
					title: 'Lý thuyết',
					dataIndex: 'gioLyThuyet',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: 'BT-TL',
					dataIndex: 'gioBaiTapTL',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: 'Thực hành',
					dataIndex: 'gioThucHanh',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: 'Tự học',
					dataIndex: 'gioTuHoc',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: 'Tổng',
					width: 60,
					align: 'center',
					render: (val, rec) => rec.gioLyThuyet + rec.gioBaiTapTL + rec.gioThucHanh + rec.gioTuHoc,
					onCell,
				},
			],
		},
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 220,
			render: (val) =>
				val && <ExpandText ellipsis={{ expandable: false }}>{decodeHtmlEntities(removeHtmlTags(val))}</ExpandText>,
			onCell,
		},
		{
			title: 'CLO',
			dataIndex: 'listMaChuanDauRa',
			width: 120,
			render: (val) => val && <ExpandText ellipsis={{ expandable: false }}>{val.join(', ')}</ExpandText>,
			onCell,
		},
		{
			title: 'Bài đánh giá',
			dataIndex: 'listTrongSoTuongUng',
			width: 120,
			render: (val) => val && <ExpandText ellipsis={{ expandable: false }}>{val.join(', ')}</ExpandText>,
			onCell,
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
