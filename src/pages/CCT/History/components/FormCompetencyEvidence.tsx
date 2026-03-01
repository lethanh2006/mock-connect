import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { FormInstance } from 'antd';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const MAX_SELECT = 3;

const FormCompetencyEvidence = (props: { listAchievedCompetencies?: string[]; form?: FormInstance }) => {
	const { listAchievedCompetencies, form } = props;
	const { isView } = useModel('cct.activityoutcome');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('cct.competency');

	useEffect(() => {
		getAllAttriCompetency();
	}, []);

	const sortedData = useMemo(() => {
		if (!dscompetency) return [];

		const selectedSet = new Set(listAchievedCompetencies ?? []);

		return [...dscompetency].sort((a, b) => {
			const aSelected = selectedSet.has(a._id);
			const bSelected = selectedSet.has(b._id);

			// selected lên trên
			if (aSelected && !bSelected) return -1;
			if (!aSelected && bSelected) return 1;

			return 0;
		});
	}, [dscompetency, listAchievedCompetencies]);

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
			data={sortedData}
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
					selectedRowKeys: listAchievedCompetencies ?? [],
					onChange: (selectedRowKeys: React.Key[]) => {
						if (isView) return;
						form &&
							form.setFieldsValue({
								listAchievedCompetencies: selectedRowKeys,
							});
					},
					getCheckboxProps: (record: any) => ({
						disabled:
							isView ||
							((listAchievedCompetencies?.length ?? 0) >= MAX_SELECT &&
								!listAchievedCompetencies?.includes(record._id)),
					}),
					hideSelectAll: true,
				},
			}}
			otherButtons={[<i className='text-info'>An activity allows a maximum of 3 competencies</i>]}
		/>
	);
};

export default FormCompetencyEvidence;
