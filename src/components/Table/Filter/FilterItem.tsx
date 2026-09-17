import ButtonExtend from '@/components/Table/ButtonExtend';
import { getDateTimeFormat } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { Icon3SquarePlusmark, IconXmark } from '@/components/Icons';
import { Card } from '@/components/PageCard';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import MyDatePicker from '../../MyDatePicker';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import { useFilterFields } from '../hooks/useFilterFields';
import { type RowFilterProps, type TDataOption } from '../typing';
import FormCheckbox from './FormCheckbox';
import './style.less';

const FilterItem = (props: RowFilterProps) => {
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
	const { fieldsFiltered } = useFilterFields(columns, formOwner);
	const [operators, setOperators] = useState<EOperatorType[]>([]);

	const namePath = Array.isArray(name) ? name : [name];
	const fullPath = parentPath ? [...parentPath, ...namePath] : ['filters', ...namePath];
	const currentFilter = Form.useWatch(fullPath, formOwner) ?? {};

	const filterColumn = columns.find(
		(item) => (Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex) === currentFilter.field,
	);
	const filterType = filterColumn?.filterType || '';

	useEffect(() => {
		let opers: EOperatorType[];
		switch (filterType as string) {
			case 'string':
				opers = [
					EOperatorType.CONTAIN,
					EOperatorType.NOT_CONTAIN,
					EOperatorType.START_WITH,
					EOperatorType.END_WITH,
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
					EOperatorType.NULL,
					EOperatorType.NOT_NULL,
				];
				break;
			case 'number':
			case 'date':
			case 'datetime':
				opers = [
					EOperatorType.EQUAL,
					EOperatorType.NOT_EQUAL,
					EOperatorType.LESS_THAN,
					EOperatorType.LESS_EQUAL,
					EOperatorType.GREAT_THAN,
					EOperatorType.GREAT_EQUAL,
					EOperatorType.BETWEEN,
					EOperatorType.NOT_BETWEEN,
				];
				break;
			case 'select':
			case 'customselect':
				opers = [EOperatorType.INCLUDE, EOperatorType.NOT_INCLUDE];
				break;

			default:
				opers = [];
				break;
		}
		setOperators(opers);
	}, [filterType]);

	const isReadOnly = props.forceReadOnly || currentFilter.readOnly;

	const renderDataComponent = () => {
		switch (filterType) {
			case 'string':
				return (
					<Input
						placeholder={intl.formatMessage({ id: 'global.table.customfilter.label.giatri' })}
						disabled={isReadOnly}
					/>
				);
			case 'date':
				return <MyDatePicker disabled={isReadOnly} />;
			case 'datetime':
				return <MyDatePicker format={getDateTimeFormat()} showTime disabled={isReadOnly} />;
			case 'number':
				return (
					<InputNumber
						className='filter-item-value-input'
						placeholder={intl.formatMessage({ id: 'global.table.customfilter.label.giatri' })}
						disabled={isReadOnly}
					/>
				);
			case 'select':
				return (
					<Select
						options={filterColumn?.filterData?.map((item: string | TDataOption) =>
							typeof item === 'string'
								? { key: item, value: item, label: item }
								: { key: item.value, value: item.value, label: item.label },
						)}
						mode='multiple'
						optionFilterProp='label'
						placeholder={intl.formatMessage({ id: 'global.table.customfilter.placeholder.chongiatri' })}
						showSearch
						disabled={isReadOnly}
					/>
				);
			case 'customselect':
				return filterColumn?.filterCustomSelect;

			default:
				return <></>;
		}
	};

	return (
		<Card size='sm'>
			<Row gutter={[8, 8]}>
				<Col span={22} md={isReadOnly ? 24 : 23}>
					<Row gutter={[8, 0]}>
						<Col span={12}>
							<Form.Item
								name={[...namePath, 'field']}
								rules={[...rules.required]}
								{...restProps}
								label={
									<Form.Item valuePropName='checked' initialValue={true} name={[...namePath, 'active']} noStyle>
										<FormCheckbox disabled={isReadOnly}>
											{intl.formatMessage({ id: 'global.table.customfilter.label.thuoctinh' })}
										</FormCheckbox>
									</Form.Item>
								}
							>
								<Select
									disabled={isReadOnly}
									onChange={() => {
										formInstance.setFieldValue([...fullPath, 'operator'], undefined);
										formInstance.setFieldValue([...fullPath, 'values'], undefined);
									}}
									options={columns
										.filter((item) => {
											const itemValue = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : item.dataIndex;
											const isSelectedByOther = fieldsFiltered.some((f) => {
												try {
													const parsed = JSON.parse(f);
													const val = Array.isArray(parsed) ? parsed.join('.') : parsed;
													return val === itemValue && val !== currentFilter.field;
												} catch (e) {
													const val = f.replace(/"/g, '');
													return val === itemValue && val !== currentFilter.field;
												}
											});

											return item.filterType && item.dataIndex && item.dataIndex !== 'index' && !isSelectedByOther;
										})
										.map((item) => ({
											label: item.title,
											value: Array.isArray(item.dataIndex)
												? item.dataIndex.join('.') // string
												: item.dataIndex,
										}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name={[...namePath, 'operator']}
								rules={[...rules.required]}
								label={intl.formatMessage({ id: 'global.table.customfilter.label.dieukien' })}
								{...restProps}
							>
								<Select
									options={operators.map((item) => ({
										key: item,
										value: item,
										label: intl.formatMessage({ id: `global.table.operator.${item}` }),
									}))}
									placeholder={intl.formatMessage({ id: 'global.table.customfilter.placeholder.chondieukien' })}
									disabled={isReadOnly}
								/>
							</Form.Item>
						</Col>

						{!!currentFilter.operator &&
						currentFilter.operator !== EOperatorType.NULL &&
						currentFilter.operator !== EOperatorType.NOT_NULL ? (
							<>
								<Col
									span={24}
									md={
										currentFilter.operator === EOperatorType.BETWEEN ||
										currentFilter.operator === EOperatorType.NOT_BETWEEN
											? 12
											: 24
									}
								>
									<Form.Item
										name={
											currentFilter.operator === EOperatorType.INCLUDE ||
											currentFilter.operator === EOperatorType.NOT_INCLUDE
												? [...namePath, 'values']
												: [...namePath, 'values', 0]
										}
										rules={[...rules.required]}
										label={intl.formatMessage({ id: 'global.table.customfilter.label.giatri' })}
										{...restProps}
									>
										{renderDataComponent()}
									</Form.Item>
								</Col>

								{currentFilter.operator === EOperatorType.BETWEEN ||
								currentFilter.operator === EOperatorType.NOT_BETWEEN ? (
									<Col span={24} md={12}>
										<Form.Item
											name={[...namePath, 'values', 1]}
											rules={[...rules.required]}
											label={intl.formatMessage({ id: 'global.table.customfilter.label.giatriden' })}
										>
											{renderDataComponent()}
										</Form.Item>
									</Col>
								) : null}
							</>
						) : null}
					</Row>
				</Col>
				{!isReadOnly && (
					<Col span={2} md={1}>
						<div className='filter-item-actions'>
							{allowGrouping && level === 0 && (
								<ButtonExtend
									type='text'
									size='small'
									icon={<Icon3SquarePlusmark />}
									onClick={() => {
										const newGroupValue = {
											active: currentFilter.active !== false,
											operator: 'and',
											filters: [currentFilter],
											indexParent: currentFilter.indexParent,
										};
										formInstance.setFieldValue(fullPath, newGroupValue);
									}}
									tooltip={intl.formatMessage({ id: 'global.table.customfilter.button.chuyenthanhnhom' })}
								/>
							)}
							{onRemove && !isReadOnly && (
								<ButtonExtend
									type='text'
									size='small'
									icon={<IconXmark />}
									onClick={onRemove}
									className='filter-danger-action'
									tooltip={intl.formatMessage({ id: 'global.table.customfilter.button.xoadieukien' })}
								/>
							)}
						</div>
					</Col>
				)}
			</Row>
		</Card>
	);
};

export default FilterItem;
