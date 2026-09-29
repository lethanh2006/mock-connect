import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { FormInstance } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const MAX_SELECT = 3;

const FormCompetencyEvidence = (props: { listAchievedCompetencies?: string[]; form?: FormInstance }) => {
	const intl = useIntl();
	const { listAchievedCompetencies, form } = props;
	const { isView } = useModel('cct.activityoutcome');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('cct.competency');

	useEffect(() => {
		getAllAttriCompetency(undefined, { order: 1 }, { isActive: true });
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
			title: intl.formatMessage({ id: 'activity.formCompetent.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activity.formCompetent.description' }),
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
			scroll={{ y: 450 }}
			otherProps={{
				pagination: false,
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
			otherExtra={[<i className='text-info'>{intl.formatMessage({ id: 'activity.formCompetent.limit' })}</i>]}
		/>
	);
};

export default FormCompetencyEvidence;
