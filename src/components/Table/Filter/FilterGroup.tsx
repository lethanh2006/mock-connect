import { IconPlus, IconXmark } from '@/components/Icons';
import { Button, Card, Checkbox, Form, Select, Space } from 'antd';
import { useMemo } from 'react';
import { useIntl } from 'umi';
import ButtonExtend from '../ButtonExtend';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import { useFilterFields } from '../hooks/useFilterFields';
import { type RowFilterProps } from '../typing';
import RowFilter from './RowFilter';

const FilterGroup = (props: RowFilterProps) => {
	const intl = useIntl();
	const { name, onRemove, allowGrouping = true, level = 0, formOwner, parentPath, ...restProps } = props;
	const { columns: rawColumns, finalColumns } = useTableContext();
	const targetColumns = useMemo(() => rawColumns || finalColumns || [], [rawColumns, finalColumns]);
	const columns = useMemo(
		() =>
			targetColumns
				.map((item) => (item.children?.length ? [item, ...item.children] : [item]))
				.flat()
				.filter((item) => item?.hide !== true),
		[targetColumns],
	);
	const formInstance = Form.useFormInstance();
	const { fieldsFilterable } = useFilterFields(columns, formInstance);

	const namePath = Array.isArray(name) ? name : [name];
	const fullPath = parentPath ? [...parentPath, ...namePath] : ['filters', ...namePath];
	const currentFilter = Form.useWatch(fullPath, formOwner) ?? {};
	const isReadOnly = props.forceReadOnly || currentFilter.readOnly;

	return (
		<Card
			size='small'
			styles={{ body: { padding: 8 } }}
			style={{
				backgroundColor: level === 0 ? '#f9f9f9' : '#f0f8ff',
				border: level === 0 ? '1px solid #d9d9d9' : '1px solid #91d5ff',
			}}
			title={
				<Space>
					<Form.Item valuePropName='checked' initialValue={true} name={[...namePath, 'active']} noStyle>
						<Checkbox disabled={isReadOnly}>
							{intl.formatMessage({ id: 'global.table.customfilter.label.nhomdieukien' })}
						</Checkbox>
					</Form.Item>
					<Form.Item name={[...namePath, 'operator']} initialValue='and' style={{ margin: 0 }} noStyle>
						<Select
							options={[
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.AND}` }), value: 'and' },
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.OR}` }), value: 'or' },
							]}
							style={{ width: 100 }}
							size='small'
							disabled={isReadOnly}
						/>
					</Form.Item>
				</Space>
			}
			extra={
				onRemove &&
				!isReadOnly && (
					<ButtonExtend
						type='text'
						size='small'
						icon={<IconXmark />}
						onClick={onRemove}
						danger
						tooltip={intl.formatMessage({ id: 'global.table.customfilter.button.xoanhomdieukien' })}
					/>
				)
			}
		>
			<Form.List name={[...namePath, 'filters']}>
				{(fields, { remove, add }) => (
					<>
						{fields.map((field, index) => {
							return (
								<RowFilter
									key={field.key}
									name={field.name}
									parentPath={[...fullPath, 'filters']}
									onRemove={() => remove(field.name)}
									allowGrouping={allowGrouping}
									level={level + 1}
									formOwner={formOwner}
									forceReadOnly={isReadOnly}
									{...restProps}
								/>
							);
						})}

						<Space style={{ marginTop: '12px' }}>
							<Button
								type='dashed'
								size='small'
								icon={<IconPlus />}
								onClick={() => {
									const rawField = fieldsFilterable[0];
									let firstAvailableField = '';
									if (rawField) {
										try {
											const parsed = JSON.parse(rawField);
											firstAvailableField = Array.isArray(parsed) ? parsed.join('.') : parsed;
										} catch {
											firstAvailableField = rawField.replace(/"/g, '');
										}
									}
									if (!firstAvailableField) return;
									add({
										active: true,
										field: firstAvailableField,
										operator: undefined,
										values: [],
									});
								}}
								disabled={isReadOnly || !fieldsFilterable.length}
							>
								{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
							</Button>
						</Space>
					</>
				)}
			</Form.List>
		</Card>
	);
};

export default FilterGroup;
