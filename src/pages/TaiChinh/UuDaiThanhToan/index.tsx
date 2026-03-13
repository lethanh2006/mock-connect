import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import { formatDate } from '@/utils/formatDate';
import { useIntl, useModel } from 'umi';

const UuDaiThanhToanPage = () => {
	const intl = useIntl();
	const { page, limit, getModel } = useModel('taichinh.uudaiuser');

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');

	const columns: IColumn<UuDaiThanhToan.IUuDaiUser>[] = [
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.namhoc' }),
			dataIndex: 'tenNamHoc',
			// filterType: 'string',
			width: 120,
			render: (val, rec) => val && rec?.maNamHoc,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.tenuudai' }),
			dataIndex: ['uuDai', 'ten'],
			// filterType: 'string',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.loaikhoanthu' }),
			dataIndex: ['uuDai', 'maKhoanThuApDung'],
			width: 140,
			render: (val, rec) => rec.uuDai?.khoanThuApDung?.name ?? val,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.giatri' }),
			dataIndex: ['uuDai', 'phanTramUuDai'],
			align: 'center',
			width: 80,
			render: (val) => val && `${val}%`,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.tongtien' }),
			dataIndex: 'tongTienUuDai',
			align: 'center',
			width: 120,
			render: (val) => val && `${val} VNĐ`,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.mota' }),
			dataIndex: ['uuDai', 'moTa'],
			width: 220,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.ngaynhan' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 100,
			render: (val) => formatDate(val),
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.column.thoigiansudung' }),
			dataIndex: 'thoiGianSuDung',
			align: 'center',
			width: 100,
			render: (val) =>
				val ? formatDate(val) : <i>{intl.formatMessage({ id: 'uudaithanhtoan.chuasudung' })}</i>,
		},
	];

	return (
		<TableBase
			buttons={{ create: false }}
			columns={columns}
			getData={getData}
			dependencies={[page, limit]}
			modelName='taichinh.uudaiuser'
			title={intl.formatMessage({ id: 'uudaithanhtoan.title' })}
		/>
	);
};

export default UuDaiThanhToanPage;
