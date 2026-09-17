import { Button, IconPlus, IconXmark } from '@/components/Icons';
import { Card } from '@/components/PageCard';
import { Form, Select } from 'antd';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useIntl } from 'umi';
import ButtonExtend from '../ButtonExtend';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import { useFilterFields } from '../hooks/useFilterFields';
import { type RowFilterProps } from '../typing';
import FormCheckbox from './FormCheckbox';
import RowFilter from './RowFilter';
import './style.less';

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
			size='sm'
			className={classNames('filter-group-card', level === 0 ? 'filter-group-card-root' : 'filter-group-card-nested')}
			title={
				<div className='filter-group-header-fields'>
					<Form.Item valuePropName='checked' initialValue={true} name={[...namePath, 'active']} noStyle>
						<FormCheckbox disabled={isReadOnly}>
							{intl.formatMessage({ id: 'global.table.customfilter.label.nhomdieukien' })}
						</FormCheckbox>
					</Form.Item>
					<Form.Item name={[...namePath, 'operator']} initialValue='and' className='filter-group-operator-item' noStyle>
						<Select
							options={[
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.AND}` }), value: 'and' },
								{ label: intl.formatMessage({ id: `global.table.operator.${EOperatorType.OR}` }), value: 'or' },
							]}
							className='filter-group-operator-select'
							size='small'
							disabled={isReadOnly}
						/>
					</Form.Item>
				</div>
			}
			extra={
				onRemove && !isReadOnly ? (
					<ButtonExtend
						type='text'
						size='small'
						icon={<IconXmark />}
						onClick={onRemove}
						className='filter-danger-action'
						tooltip={intl.formatMessage({ id: 'global.table.customfilter.button.xoanhomdieukien' })}
					/>
				) : undefined
			}
		>
			<Form.List name={[...namePath, 'filters']}>
				{(fields, { remove, add }) => (
					<div className='filter-group-rows-list'>
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

						<Button
							variant='outline'
							type='button'
							size='sm'
							className='filter-group-add-button'
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
					</div>
				)}
			</Form.List>
		</Card>
	);
};

export default FilterGroup;
