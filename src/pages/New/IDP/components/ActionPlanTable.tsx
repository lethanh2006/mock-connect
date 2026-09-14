import {
	IDP_ACTION_MAX_LENGTH,
	IDP_ACTION_PLAN_MAX_ITEMS,
	IDP_ACTION_PLAN_MIN_ITEMS,
	IDP_SMART_OUTCOME_MAX_LENGTH,
	IDP_TIMELINE_AND_SUPPORT_MAX_LENGTH,
} from '@/services/Idp/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Table } from 'antd';
import type { FormListFieldData } from 'antd/es/form/FormList';
import { useIntl } from 'umi';
import styles from './ActionPlanTable.less';

const { TextArea } = Input;

type ActionPlanTableProps = {
	disabled?: boolean;
};

const ActionPlanTable: React.FC<ActionPlanTableProps> = ({ disabled }) => {
	const intl = useIntl();

	return (
		<Form.List name='actionPlan'>
			{(fields, { add, remove }) => {
				const columns = [
					{
						title: intl.formatMessage({ id: 'idp.actionPlan.column.actions' }),
						width: '22%',
						render: (_: any, field: FormListFieldData) => (
							<Form.Item
								name={[field.name, 'action']}
								style={{ marginBottom: 0 }}
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_ACTION_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 2, maxRows: 2 }} maxLength={IDP_ACTION_MAX_LENGTH} disabled={disabled} />
							</Form.Item>
						),
					},
					{
						title: intl.formatMessage({ id: 'idp.actionPlan.column.smartOutcomes' }),
						width: '28%',
						render: (_: any, field: FormListFieldData) => (
							<Form.Item
								name={[field.name, 'smartOutcome']}
								style={{ marginBottom: 0 }}
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_SMART_OUTCOME_MAX_LENGTH)]}
							>
								<TextArea
									autoSize={{ minRows: 2, maxRows: 2 }}
									maxLength={IDP_SMART_OUTCOME_MAX_LENGTH}
									disabled={disabled}
								/>
							</Form.Item>
						),
					},
					{
						title: intl.formatMessage({ id: 'idp.actionPlan.column.timeline' }),
						width: '28%',
						render: (_: any, field: FormListFieldData) => (
							<Form.Item
								name={[field.name, 'timelineAndSupport']}
								style={{ marginBottom: 0 }}
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_TIMELINE_AND_SUPPORT_MAX_LENGTH)]}
							>
								<TextArea
									autoSize={{ minRows: 2, maxRows: 2 }}
									maxLength={IDP_TIMELINE_AND_SUPPORT_MAX_LENGTH}
									disabled={disabled}
								/>
							</Form.Item>
						),
					},
					{
						title: intl.formatMessage({ id: 'idp.actionPlan.column.checkpoints' }),
						width: '15%',
						render: (_: any, field: FormListFieldData) => (
							<Form.Item
								name={[field.name, 'progressCheckpoint']}
								getValueProps={(value) => ({ value: value ? dayjs(value) : undefined })}
								normalize={(value) => (value ? value.format('YYYY-MM-DD') : null)}
							>
								<DatePicker
									format='DD/MM/YYYY'
									allowClear
									style={{ width: '100%', marginBottom: '-10px' }}
									disabled={disabled}
								/>
							</Form.Item>
						),
					},
					...(disabled
						? []
						: [
								{
									title: '',
									width: 48,
									render: (_: any, field: FormListFieldData) => (
										<Button
											type='text'
											danger
											icon={<DeleteOutlined />}
											disabled={fields.length <= IDP_ACTION_PLAN_MIN_ITEMS}
											onClick={() => remove(field.name)}
										/>
									),
								},
							]),
				];

				return (
					<>
						<Table
							className={styles.table}
							rowKey={(field: any) => field.key}
							columns={columns as any}
							dataSource={fields}
							pagination={false}
							bordered
							size='small'
						/>

						{!disabled && (
							<Button
								type='dashed'
								icon={<PlusOutlined />}
								style={{ marginTop: 8 }}
								onClick={() => add({ action: '', smartOutcome: '', timelineAndSupport: '', progressCheckpoint: null })}
								disabled={fields.length >= IDP_ACTION_PLAN_MAX_ITEMS}
								block
							>
								{intl.formatMessage({ id: 'idp.actionPlan.addButton' })}
							</Button>
						)}
					</>
				);
			}}
		</Form.List>
	);
};

export default ActionPlanTable;
