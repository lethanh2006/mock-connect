import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { useIntl, useModel } from 'umi';

const ChuanDauRaHocPhanPage = () => {
	const intl = useIntl();
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
	const { page, limit, getModel } = useModel('hocphan.decuongcdr');
	const cond = { deCuongId: recDeCuong?._id };

	const getData = () => recDeCuong?._id && getModel(cond);

	const columns: IColumn<HocPhan.IChuanDauRa>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura.maCLO' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura.noidung' }),
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura.diemnl' }),
			dataIndex: 'diemToiThieu',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura.ghichu' }),
			dataIndex: 'moTa',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				params={cond}
				dependencies={[page, limit, recDeCuong?._id]}
				modelName='hocphan.decuongcdr'
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.chuandaura.title' })}
				formProps={{ getData }}
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default ChuanDauRaHocPhanPage;
