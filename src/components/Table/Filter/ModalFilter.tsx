import { PlusOutlined, PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Modal, Space, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { useFilterFields } from '../hooks/useFilterFields';
import { normalizeFilters } from '../utils';
import { ModalFooter } from './ModalFooter';
import RowFilter from './RowFilter';

const { Text } = Typography;

const ModalFilter = () => {
	const intl = useIntl();
	const {
		columns: originalColumns,
		finalColumns,
		setFilters,
		visibleFilter,
		setVisibleFilter,
		filters,
		externalConditions,
	} = useTableContext();
	const columns = originalColumns || finalColumns;
	const [form] = Form.useForm();
	const { fieldsFilterable } = useFilterFields(columns, form);

	const fieldMetaMap = useMemo(() => {
		const map: Record<string, { label: string; valueLabelMap: Record<string, string> }> = {};

		const allColumns = columns
			.map((item) => {
				if (item.children?.length) return [item, ...item.children];
				return [item];
			})
			.flat();

		allColumns.forEach((column: any) => {
			if (!column?.dataIndex || column.dataIndex === 'index') return;

			const fieldKey = Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : String(column.dataIndex);
			const label =
				typeof column.title === 'string' || typeof column.title === 'number' ? String(column.title) : fieldKey;

			if (!map[fieldKey]) {
				map[fieldKey] = { label, valueLabelMap: {} };
			}

			if (Array.isArray(column.filterData)) {
				column.filterData.forEach((item: any) => {
					if (typeof item === 'string') {
						map[fieldKey].valueLabelMap[item] = item;
						return;
					}

					if (item && item.value !== undefined) {
						map[fieldKey].valueLabelMap[String(item.value)] = item.label ?? String(item.value);
					}
				});
			}
		});

		return map;
	}, [columns]);

	const externalConditionRows = useMemo(() => {
		if (!externalConditions || !Array.isArray(externalConditions) || externalConditions.length === 0) {
			return [];
		}

		const formatScalarValue = (item: any): string => {
			if (item.value === null || item.value === undefined)
					return '-';

			if (typeof item.valueLabel === 'string') return item.valueLabel;
			if (typeof item.valueLabel === 'object' && item.valueLabel[String(item.value)])
				return item.valueLabel[String(item.value)];

			const fieldMetaValueLabel = fieldMetaMap[item.field]?.valueLabelMap?.[String(item.value)];
			if (fieldMetaValueLabel !== undefined) return fieldMetaValueLabel;

			if (typeof item.value === 'string' || typeof item.value === 'number' || typeof item.value === 'boolean') {
				return String(item.value);
			}

			return JSON.stringify(item.value);
		};

		const formatListValue = (item: any): string => {
			const values = Array.isArray(item.value) ? item.value : [item.value];
			return `[${values.map((v: any) => formatScalarValue({ ...item, value: v })).join(', ')}]`;
		};

		const formatConditionExpression = (item: any): string => {
			const { operator } = item;
			const op = operator || '$eq';

			const OPERATOR_RENDERER: Record<string, (item: any) => string> = {
				$eq: (i) =>
					Array.isArray(i.value)
						? `${intl.formatMessage({ id: 'global.table.operator.in' })} ${formatListValue(i)}`
						: formatScalarValue(i),
				$ne: (i) => {
					if (typeof i.value === 'boolean') {
						const oppositeValue = !i.value;
						if (typeof i.valueLabel === 'object' && i.valueLabel[String(oppositeValue)]) {
							return i.valueLabel[String(oppositeValue)];
						}
					}
					return `${intl.formatMessage({ id: 'global.table.operator.ne' })} ${formatScalarValue(i)}`;
				},
				$in: (i) => `${intl.formatMessage({ id: 'global.table.operator.in' })} ${formatListValue(i)}`,
				$nin: (i) => `${intl.formatMessage({ id: 'global.table.operator.not_in' })} ${formatListValue(i)}`,
				$gt: (i) => `${intl.formatMessage({ id: 'global.table.operator.gt' })} ${formatScalarValue(i)}`,
				$gte: (i) => `${intl.formatMessage({ id: 'global.table.operator.gte' })} ${formatScalarValue(i)}`,
				$lt: (i) => `${intl.formatMessage({ id: 'global.table.operator.lt' })} ${formatScalarValue(i)}`,
				$lte: (i) => `${intl.formatMessage({ id: 'global.table.operator.lte' })} ${formatScalarValue(i)}`,
				$exist: (i) =>
					intl.formatMessage({
						id: i.value ? 'global.table.operator.exist' : 'global.table.operator.not_exist',
					}),
				$like: (i) => `${intl.formatMessage({ id: 'global.table.operator.contain' })} ${formatScalarValue(i)}`,
				$regex: (i) => `${intl.formatMessage({ id: 'global.table.operator.regex' })} ${formatScalarValue(i)}`,
				// $not: (i) => `${intl.formatMessage({ id: 'global.table.operator.not' })} (${formatConditionExpression(i)})`,
			};

			const renderer = OPERATOR_RENDERER[op];
			if (renderer) return renderer(item);
			return `${op} ${formatScalarValue(item)}`;
		};

		return externalConditions.map((item) => ({
			key: String(item.field),
			label: item.label || fieldMetaMap[String(item.field)]?.label || String(item.field),
			expression: formatConditionExpression(item),
		}));
	}, [externalConditions, fieldMetaMap, intl]);

	const INITIAL_CONDITION_ROWS = 4;
	const LOAD_MORE_STEP = 4;

	const [maxConditionRows, setMaxConditionRows] = useState(INITIAL_CONDITION_ROWS);
	const visibleConditionRows = externalConditionRows.slice(0, maxConditionRows);
	const hiddenConditionRows = Math.max(0, externalConditionRows.length - visibleConditionRows.length);

	const handleFinish = (values: any) => {
		const normalizedFilters = normalizeFilters(values.filters);
		setFilters?.(normalizedFilters);
		setVisibleFilter?.(false);
	};

	useEffect(() => {
		if (visibleFilter) {
			form.setFieldsValue({ filters: filters || [] });
		}
	}, [visibleFilter, filters, form]);

	const handleReset = () => {
		form.resetFields();
	};

	return (
		<Modal
			open={visibleFilter}
			onCancel={() => setVisibleFilter?.(false)}
			footer={<ModalFooter onReset={handleReset} onCancel={() => setVisibleFilter?.(false)} />}
			title={intl.formatMessage({ id: 'global.table.customfilter.title' })}
			width={800}
		>
			{visibleConditionRows.length ? (
				<div
					style={{
						marginBottom: 12,
						padding: '8px 8px',
						borderRadius: 6,
						background: '#fafafa',
						border: '1px solid #f0f0f0',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<Tooltip
							title={intl.formatMessage({
								id: 'global.table.customfilter.tooltip.applied',
								defaultMessage: 'Filter conditions currently applied to the table',
							})}
						>
							<Text strong>
								{intl.formatMessage({ id: 'global.table.customfilter.dieukien', defaultMessage: 'Conditions' })}{' '}
							</Text>
							<QuestionCircleOutlined style={{ fontSize: 12, color: '#999' }} />
						</Tooltip>
						<Text strong>:</Text>
					</div>
					<div style={{ marginTop: 8 }}>
						<Descriptions
							column={
								visibleConditionRows.length === 1 || visibleConditionRows.some((row) => row.expression.length > 50)
									? 1
									: { xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }
							}
							size='small'
							layout='horizontal'
						>
							{visibleConditionRows.map((row) => (
								<Descriptions.Item key={row.key} label={row.label}>
									{row.expression}
								</Descriptions.Item>
							))}
						</Descriptions>
					</div>

					{hiddenConditionRows > 0 ? (
						<div style={{ marginTop: 4 }}>
							<Text type='secondary' style={{ marginRight: 8 }}>
								{intl.formatMessage(
									{ id: 'global.table.customfilter.moreconditions', defaultMessage: '+{count} more conditions' },
									{ count: hiddenConditionRows },
								)}
							</Text>
							<Button
								size='small'
								type='link'
								style={{ padding: 0 }}
								onClick={() => setMaxConditionRows((prev) => prev + LOAD_MORE_STEP)}
							>
								{intl.formatMessage({ id: 'global.table.customfilter.button.xemthem', defaultMessage: 'View more' })}
							</Button>
						</div>
					) : null}
				</div>
			) : null}

			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				id='custom-filter-form'
				initialValues={{ filters: [] }}
			>
				<Form.List name='filters'>
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.length > 0 && (
									<Space direction='vertical' size={8} style={{ marginBottom: '16px', width: '100%' }}>
										{fields.map(({ key, name, ...restField }) => {
											return (
												<RowFilter
													key={key}
													name={name}
													formOwner={form}
													onRemove={() => remove(name)}
													allowGrouping
													level={0}
													{...restField}
												/>
											);
										})}
									</Space>
								)}

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
									<Button
										block
										type='dashed'
										disabled={!fieldsFilterable.length}
										icon={<PlusOutlined />}
										onClick={() => {
											const firstAvailableField = fieldsFilterable[0]?.replace(/"/g, '') ?? '';
											if (firstAvailableField) {
												add({
													field: firstAvailableField,
													operator: undefined,
													values: undefined,
													active: true,
												});
											}
										}}
									>
										{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
									</Button>
									<Button
										type='dashed'
										block
										disabled={!fieldsFilterable.length}
										icon={<PlusSquareOutlined />}
										onClick={() => {
											add({
												operator: 'and',
												active: true,
												filters: [],
											});
										}}
									>
										{intl.formatMessage({ id: 'global.table.customfilter.button.themnhom' })}
									</Button>
								</div>
							</>
						);
					}}
				</Form.List>
			</Form>
		</Modal>
	);
};

export default ModalFilter;
