import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import FormCompetencyMapping from './Form';

const FormItemCompetencyMapping = (props: {
	value?: Activity.ICompetencyMapping[];
	onChange?: (data: Activity.ICompetencyMapping[]) => void;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const {
		setVisibleForm,
		visibleForm,
		edit,
		record,
		// setEdit, setRecord, setIsView
		handleEdit,
	} = useModel('cct.competencymapping');
	const { value = [], onChange, disabled } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: Activity.ICompetencyMapping) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<Activity.ICompetencyMapping>[] = [
		{
			title: 'Attributes',
			dataIndex: 'attributesId',
			width: 180,
			render: (val, rec) => <Tag color={rec?.attributes?.color}>{rec?.attributes?.name}</Tag>,
		},
		{
			title: 'Competency',
			dataIndex: 'dsCompetencie',
			width: 280,
			render: (val, rec) =>
				rec?.dsCompetencie
					?.map((item) => item?.name)
					.filter(Boolean)
					.join(', '),
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={disabled}
						type='link'
						icon={<EditOutlined />}
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => {
							handleEdit(rec);
						}}
					/>

					<Popconfirm
						onConfirm={() => onDelete((rec?.index ?? 0) - 1)}
						title='Do you want to remove?'
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
		<>
			<TableStaticData data={value} columns={columns} size='small' hasTotal addStt>
				{/* <Button
					disabled={disabled}
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
				</Button> */}
			</TableStaticData>

			<Modal
				title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} Competency Mapping`}
				open={visibleForm}
				width={700}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormCompetencyMapping onOk={onAdd} value={value} />
			</Modal>
		</>
	);
};

export default FormItemCompetencyMapping;
