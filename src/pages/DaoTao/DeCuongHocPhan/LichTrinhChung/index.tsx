import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { decodeHtmlEntities, removeHtmlTags } from '@/utils/utils';
import { useIntl, useModel } from 'umi';
import ViewLichTrinhDeCuong from './View';

const NoiDungHocPhanPage = () => {
	const intl = useIntl();
	const { page, limit, handleView } = useModel('hocphan.noidunghp');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const onCell = (rec: HocPhan.ILichTrinhChung) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<HocPhan.ILichTrinhChung>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.tieuDe' }),
			dataIndex: 'tieuDe',
			width: 180,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.giaidoan' }),
			dataIndex: 'giaiDoanDayHoc',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.thoiluong' }),
			width: 300,
			children: [
				{
					title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.lythuyet' }),
					dataIndex: 'gioLyThuyet',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.bt' }),
					dataIndex: 'gioBaiTapTL',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.thuchanh' }),
					dataIndex: 'gioThucHanh',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.tuhoc' }),
					dataIndex: 'gioTuHoc',
					width: 60,
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.tong' }),
					width: 60,
					align: 'center',
					render: (val, rec) => rec.gioLyThuyet + rec.gioBaiTapTL + rec.gioThucHanh + rec.gioTuHoc,
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.noidung' }),
			dataIndex: 'ten',
			width: 220,
			render: (val) =>
				val && <ExpandText ellipsis={{ expandable: false }}>{decodeHtmlEntities(removeHtmlTags(val))}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.CLO' }),
			dataIndex: 'listMaChuanDauRa',
			width: 120,
			render: (val) => val && <ExpandText ellipsis={{ expandable: false }}>{val.join(', ')}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.baidanhgia' }),
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
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.tomtat.title' })}
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
