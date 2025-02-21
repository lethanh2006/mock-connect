import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const DangTaiLieuPage = () => {
	const { getModel, page, limit, record, setRecord } = useModel('thuvien.dangtailieu');

	const getData = () => {
		getModel().then((res) => setRecord(res[0]));
	};

	const onCell = (rec: DangTaiLieu.IRecord) => ({
		onClick: () => {
			setRecord(rec);
		},
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			color: rec._id === record?._id ? 'var(--primary-color)' : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<DangTaiLieu.IRecord>[] = [
		{
			title: 'Dạng tài liệu',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
			onCell,
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='thuvien.dangtailieu'
			buttons={{ create: false }}
			otherProps={{ size: 'small' }}
			addStt={false}
			hideCard
		/>
	);
};

export default DangTaiLieuPage;
