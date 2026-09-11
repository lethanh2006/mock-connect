import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { IconEyeOpen } from '@/components/Icons';
import { Checkbox } from 'antd';
import { useIntl, useModel } from 'umi';

const HocLieuDeCuongPage = () => {
	const intl = useIntl();
	const { page, limit, getModel } = useModel('hocphan.hoclieudecuong');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
	const { settings } = useModel('tienich.caidat');

	const getData = () => recDeCuong?._id && getModel({ deCuongId: recDeCuong?._id });

	const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.tieude' }),
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.tacgia' }),
			dataIndex: 'tacGia',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.nxb' }),
			dataIndex: 'tenNhaXuatBan',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.namxb' }),
			dataIndex: 'namXuatBan',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.mota' }),
			dataIndex: 'moTa',
			width: 250,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.batbuoc' }),
			width: 100,
			dataIndex: 'batBuoc',
			align: 'center',
			render: (val) => <Checkbox checked={val} disabled />,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.thaotac' }),
			dataIndex: 'url',
			width: 60,
			align: 'center',
			fixed: 'right',
			render: (val) =>
				val ? (
					<a
						href={`${settings?.THU_VIEN_HOC_LIEU?.enable ? settings?.THU_VIEN_HOC_LIEU?.thuVienUrl : APP_CONFIG_URL_THU_VIEN
							}${val}`}
						target='_blank'
						rel='noreferrer'
						title={intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.xemchitiet' })}
					>
						<IconEyeOpen />
					</a>
				) : null,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDeCuong?._id]}
				modelName='hocphan.hoclieudecuong'
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.hoclieu.title' })}
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default HocLieuDeCuongPage;
