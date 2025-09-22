import { CloseOutlined, FilterFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, Typography, Select } from 'antd';
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
	const [logicOperator, setLogicOperator] = useState<'and' | 'or'>('and');
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

	const onFinish = (values: any) => {
		const filtered = values.filters
			?.map((filter: TFilter<any>, index: number) => ({
				...filter,
				...filtersTemp[index],
				values: filter.values && Array.isArray(filter.values[0]) ? filter.values[0] : filter.values,
			}))
			?.filter((filter: TFilter<any>) => {
				if (filter.operator === EOperatorType.NULL || filter.operator === EOperatorType.NOT_NULL) {
					return true;
				}
				return filter.values && Array.isArray(filter.values) && filter.values.length > 0;
			});
		if (filtered && filtered.length > 1) {
			const filtersWithLogic = filtered.map((filter: TFilter<any>, index: number) => ({
				...filter,
				logicOperator: index === 0 ? undefined : logicOperator
			}));
			setFilters(filtersWithLogic);
		} else {
			setFilters(filtered || []);
		}
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
						setLogicOperator('and');
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
			<Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
				{intl.formatMessage({ id: 'global.table.customfilter.dieukien' })}:
			</Text>

			{filtersTemp.length > 1 && (
				<div style={{ marginBottom: '16px' }}>
					<Text strong>Điều kiện: </Text>
					<Select
						value={logicOperator}
						onChange={(value) => setLogicOperator(value)}
						size="small"
						style={{ width: 100 }}
					>
						<Select.Option value="and">Và</Select.Option>
						<Select.Option value="or">Hoặc</Select.Option>
					</Select>
				</div>
			)}

			<Form form={form} layout='vertical' onFinish={onFinish} id='custom-filter-form'>
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
					/>
				))}

				<Form.Item>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Button
							block
							type='dashed'
							disabled={!fieldsFilterable.length}
							icon={<PlusOutlined />}
							onClick={() => {
								setFiltersTemp([
									...filtersTemp,
									{
										active: true,
										field: fieldsFilterable[0]?.replace(/"/g, '') ?? '',
										values: [],
									},
								]);
							}}
						>
							{intl.formatMessage({ id: 'global.table.customfilter.button.them' })}
						</Button>
						<Button
							type="dashed"
							block
							icon={<PlusOutlined />}
							onClick={() => {
								const newGroup: TFilter<any> = {
									active: true,
									logicOperator: 'and',
									filters: [],
								};
								setFiltersTemp([
									...filtersTemp,
									newGroup
								]);
							}}
							style={{ marginLeft: '8px' }}
						>
							Thêm nhóm
						</Button>
					</div>

				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalCustomFilter;
