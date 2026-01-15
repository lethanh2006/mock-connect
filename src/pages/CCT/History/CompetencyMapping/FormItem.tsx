import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormCompetencyMapping from './Form';

const FormItemCompetencyMapping = (props: {
	value?: Activity.ICompetencyMapping[];
	onChange?: (data: Activity.ICompetencyMapping[]) => void;
	disabled?: boolean;
	attributesId?: string;
}) => {
	const intl = useIntl();
	const { setVisibleForm, visibleForm, setEdit, edit, setRecord, setIsView } = useModel('cct.competencymapping');
	const { value = [], onChange, disabled, attributesId } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (recs: Activity.ICompetencyMapping[]) => {
		const data = [...value, ...recs];
		if (onChange) onChange(data);
		setVisibleForm(false);
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
						onConfirm={() => onDelete((rec?.index ?? 0) - 1)}
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
			<TableStaticData data={value} columns={columns} size='small' hasTotal addStt>
				<Button
					disabled={disabled}
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setRecord({} as Activity.ICompetencyMapping);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					{intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
			</TableStaticData>

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} Attributes Competency Mapping`}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormCompetencyMapping onOk={onAdd} attributesId={attributesId} />
			</Modal>
		</div>
	);
};

export default FormItemCompetencyMapping;
