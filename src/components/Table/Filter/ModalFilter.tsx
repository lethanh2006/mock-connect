import { PlusOutlined, PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Modal, Space, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import type { ConditionCriteria } from '../typing';
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
		externalConditionLabels,
		externalConditionValueLabels,
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
				typeof column.title === 'string' || typeof column.title === 'number'
					? String(column.title)
					: fieldKey;

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
		if (!externalConditions || Object.keys(externalConditions).length === 0) {
			return [];
		}

		const isCriteriaObject = (value: any) => {
			if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
			return Object.keys(value).some((key) => key.startsWith('$'));
		};

		const formatScalarValue = (field: string, value: any): string => {
			if (value === null || value === undefined) return intl.formatMessage({ id: 'global.table.operator.null' });

			const externalValueLabel = externalConditionValueLabels?.[field]?.[String(value)];
			if (externalValueLabel !== undefined) return externalValueLabel;

			const valueLabel = fieldMetaMap[field]?.valueLabelMap?.[String(value)];
			if (valueLabel !== undefined) return valueLabel;

			if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
				return String(value);
			}

			return JSON.stringify(value);
		};

		const formatListValue = (field: string, value: any): string => {
			const values = Array.isArray(value) ? value : [value];
			return `[${values.map((item) => formatScalarValue(field, item)).join(', ')}]`;
		};

		const formatConditionExpression = (field: string, conditionValue: any): string => {
			if (!isCriteriaObject(conditionValue)) {
				if (Array.isArray(conditionValue)) return `${intl.formatMessage({ id: 'global.table.operator.in' })} ${formatListValue(field, conditionValue)}`;
				return formatScalarValue(field, conditionValue);
			}

			const formatItemExpression = (f: string, v: any, op: keyof ConditionCriteria<any> = '$eq'): string => {
				const OPERATOR_RENDERER: Record<
					keyof ConditionCriteria<any>,
					(field: string, value: any) => string
				> = {
					$eq: (field, value) => (Array.isArray(value) ? `${intl.formatMessage({ id: 'global.table.operator.in' })} ${formatListValue(field, value)}` : formatScalarValue(field, value)),
					$ne: (field, value) => {
						if (typeof value === 'boolean') {
							const oppositeValueLabel = externalConditionValueLabels?.[field]?.[String(!value)];
							if (oppositeValueLabel !== undefined) return oppositeValueLabel;
						}
						return `${intl.formatMessage({ id: 'global.table.operator.ne' })} ${formatScalarValue(field, value)}`;
					},
					$in: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.in' })} ${formatListValue(field, value)}`,
					$nin: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.not_in' })} ${formatListValue(field, value)}`,
					$gt: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.gt' })} ${formatScalarValue(field, value)}`,
					$gte: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.gte' })} ${formatScalarValue(field, value)}`,
					$lt: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.lt' })} ${formatScalarValue(field, value)}`,
					$lte: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.lte' })} ${formatScalarValue(field, value)}`,
					$exist: (field, value) =>
						intl.formatMessage({
							id: value ? 'global.table.operator.exist' : 'global.table.operator.not_exist',
						}),
					$like: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.contain' })} ${formatScalarValue(field, value)}`,
					$regex: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.regex' })} ${formatScalarValue(field, value)}`,
					$not: (field, value) => `${intl.formatMessage({ id: 'global.table.operator.not' })} (${formatConditionExpression(field, value)})`,
				};

				const renderer = OPERATOR_RENDERER[op];
				if (renderer) return renderer(f, v);
				return `${op} ${formatScalarValue(f, v)}`;
			};

			const parts = Object.entries(conditionValue).map(([operator, value]) => {
				return formatItemExpression(field, value, operator as keyof ConditionCriteria<any>);
			});

			return parts.join(` ${intl.formatMessage({ id: 'global.table.operator.and' })} `);
		};

		return Object.entries(externalConditions).map(([field, conditionValue]) => ({
			key: field,
			label: externalConditionLabels?.[field] ?? fieldMetaMap[field]?.label ?? field,
			expression: formatConditionExpression(field, conditionValue),
		}));
	}, [externalConditions, externalConditionLabels, externalConditionValueLabels, fieldMetaMap, intl]);


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
						<Tooltip title={intl.formatMessage({ id: 'global.table.customfilter.tooltip.applied', defaultMessage: 'Filter conditions currently applied to the table' })}>
							<Text strong>{intl.formatMessage({ id: 'global.table.customfilter.dieukien', defaultMessage: 'Conditions' })} </Text>
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
									{ count: hiddenConditionRows }
								)}
							</Text>
							<Button size='small' type='link' style={{ padding: 0 }} onClick={() => setMaxConditionRows((prev) => prev + LOAD_MORE_STEP)}>
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
