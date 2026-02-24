import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { FormInstance } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const MAX_SELECT = 3;

const FormCompetencyEvidence = (props: { competencyList?: string[]; form?: FormInstance }) => {
	const { competencyList, form } = props;
	const { isView } = useModel('cct.activityoutcome');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('cct.competency');

	useEffect(() => {
		getAllAttriCompetency();
	}, []);

	const columns: IColumn<Competency.IRecord>[] = [
		{
			title: 'Name',
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: 250,
			render: (val, rec) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={dscompetency}
			loading={loading}
			hasTotal
			onReload={getAllAttriCompetency}
			otherProps={{
				pagination: false,
				scroll: { y: 250 },
				rowKey: '_id',
				rowSelection: {
					type: 'checkbox',
					columnWidth: 40,
					selectedRowKeys: competencyList ?? [],
					onChange: (selectedRowKeys: React.Key[]) => {
						if (isView) return;
						form &&
							form.setFieldsValue({
								competencyList: selectedRowKeys,
							});
					},
					getCheckboxProps: (record: any) => ({
						disabled: isView || ((competencyList?.length ?? 0) >= MAX_SELECT && !competencyList?.includes(record._id)),
					}),
					hideSelectAll: true,
				},
			}}
			otherButtons={[<i className='text-info'>An activity allows a maximum of 3 competencies</i>]}
		/>
	);
};

export default FormCompetencyEvidence;
