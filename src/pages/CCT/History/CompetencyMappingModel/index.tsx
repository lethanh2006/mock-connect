import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormCompetencyMappingModel from './Form';

const CompetencyMappingModelPage = (props: { disabled?: boolean; attributesId?: string }) => {
	const intl = useIntl();
	const { disabled, attributesId } = props;
	const { record: recOutCome } = useModel('cct.activityoutcome');
	const { getModel, page, limit, deleteModel } = useModel('cct.competencymapping');

	const getData = () => {
		if (recOutCome?._id)
			getModel({
				activityOutcomeId: recOutCome?._id,
			});
	};

	const columns: IColumn<Activity.ICompetencyMapping>[] = [
		{
			title: 'Competency',
			width: 150,
			render: (val, rec) => rec?.competencie?.name,
		},
		{
			title: 'Description',
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.competencie?.description}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id, getData)}
						title='Do you want to remove'
						placement='topLeft'
						disabled={disabled}
					>
						<ButtonExtend
							disabled={disabled}
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<div style={{ padding: '0px 18px 0px 18px' }}>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recOutCome?._id]}
				modelName='cct.competencymapping'
				title='Competency Mapping'
				Form={FormCompetencyMappingModel}
				formProps={{ getData, attributesId }}
				buttons={{ create: !disabled }}
				hideCard
				otherProps={{
					size: 'small',
				}}
			/>
		</div>
	);
};

export default CompetencyMappingModelPage;
