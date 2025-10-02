import { CloseOutlined, FilterFilled, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { EOperatorType } from './constant';
import { findFiltersInColumns } from './function';
import RowFilter from './RowFilter';
import { type IColumn, type TFilter } from './typing';

const { Text } = Typography;

const ModalCustomFilter = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	columns: IColumn<any>[];
	filters: TFilter<any>[];
	setFilters: any;
}) => {
	const intl = useIntl();
	const { visible, setVisible, columns, filters, setFilters } = props;
	const [filtersTemp, setFiltersTemp] = useState<TFilter<any>[]>([]);
	const [form] = Form.useForm();
	const fieldsFiltered = filtersTemp.map((item) => JSON.stringify(item.field));
	const fieldsFilterable = columns
		.filter((item) => item.filterType && item.dataIndex && !fieldsFiltered.includes(JSON.stringify(item.dataIndex)))
		.map((item) => JSON.stringify(item.dataIndex));

	useEffect(() => {
		const fil = findFiltersInColumns(columns, filters);
		setFiltersTemp(fil ?? []);
		if (visible) form.setFieldsValue({ filters: fil });
	}, [filters, visible]);

	const getFormValueByPath = (formValues: any, path: (string | number)[]): any => {
		let value = formValues;
		for (const key of path) {
			value = value?.[key];
		}
		return value;
	};

	const normalizeFilter = (tempFilter: TFilter<any>, formValues: any, path: (string | number)[]): TFilter<any> => {

		let field: any = tempFilter.field;
		if (typeof field === 'string' && field.includes('.')) {
			const parts = field.split('.');
			field = parts.length === 2 ? [parts[0], parts[1]] : parts[0];
		}


		if (tempFilter.filters && Array.isArray(tempFilter.filters)) {
			return {
				logicOperator: tempFilter.logicOperator || 'and',
				filters: tempFilter.filters.map((subTempFilter, subIndex) => {
					const subPath = [...path, 'filters', subIndex];
					return normalizeFilter(subTempFilter, formValues, subPath);
				}),
			};
		}


		const result: TFilter<any> = {
			field,
			operator: tempFilter.operator,
			active: tempFilter.active,
		};


		const valuesPath = [...path, 'values'];
		let formFilterValues = getFormValueByPath(formValues, valuesPath);


		if (formFilterValues && Array.isArray(formFilterValues[0])) {
			formFilterValues = formFilterValues[0];
		}

		if (tempFilter.operator !== EOperatorType.NULL && tempFilter.operator !== EOperatorType.NOT_NULL) {
			result.values = formFilterValues || [];
		}

		return result;
	};

	const onFinish = (values: any) => {
		const filtered = filtersTemp
			?.map((tempFilter, index) => {
				const path = ['filters', index];
				return normalizeFilter(tempFilter, values, path);
			})
			?.filter((filter: TFilter<any>) => {

				if (filter.filters) {
					return filter.filters.length > 0;
				}

				if (filter.operator === EOperatorType.NULL || filter.operator === EOperatorType.NOT_NULL) {
					return true;
				}
				return filter.values && Array.isArray(filter.values) && filter.values.length > 0;
			});

		setFilters(filtered || []);
		setVisible(false);
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			footer={[
				<Button key='submit' htmlType='submit' type='primary' icon={<FilterFilled />} form='custom-filter-form'>
					{intl.formatMessage({ id: 'global.table.customfilter.button.apdung' })}
				</Button>,
				<Button
					key='reset'
					danger
					icon={<CloseOutlined />}
					onClick={() => {
						form.resetFields();
						setFiltersTemp([]);
						setFilters(undefined);
						setVisible(false);
					}}
				>
					{intl.formatMessage({ id: 'global.table.customfilter.button.xoa' })}
				</Button>,
				<Button key='cancel' onClick={() => setVisible(false)}>
					{intl.formatMessage({ id: 'global.table.customfilter.button.huy' })}
				</Button>,
			]}
			title={intl.formatMessage({ id: 'global.table.customfilter.title' })}
			width={800}
		>
			<Text type='secondary' style={{ marginBottom: '16px', display: 'block' }}>
				{intl.formatMessage({ id: 'global.table.customfilter.dieukien' })}:
			</Text>

			<Form form={form} layout='vertical' onFinish={onFinish} id='custom-filter-form'>
				{filtersTemp.length > 0 && (
					<div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
						{filtersTemp.map((filter, index) => (
							<RowFilter
								index={index}
								columns={columns}
								key={(filter.field ?? '').toString()}
								filter={filter}
								fieldsFilterable={fieldsFilterable}
								onChange={(fil) => {
									const temp = [...filtersTemp];
									temp[index] = fil;
									setFiltersTemp(temp);
								}}
								onRemove={() => {
									const temp = [...filtersTemp];
									temp.splice(index, 1);
									setFiltersTemp(temp);
								}}
								allowGrouping={true}
								path={['filters', index]}
							/>
						))}
					</div>
				)}

				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
					<Button
						block
						type='dashed'
						disabled={!fieldsFilterable.length}
						icon={<PlusOutlined />}
						onClick={() => {
							setFiltersTemp([
								...filtersTemp,
								{
									field: fieldsFilterable[0]?.replace(/"/g, '') ?? '',
									values: [],
								},
							]);
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
							const newGroup: TFilter<any> = {
								filters: [],
							};
							setFiltersTemp([...filtersTemp, newGroup]);
						}}
					>
						Thêm nhóm
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCustomFilter;
