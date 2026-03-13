import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { FilterSuKienValue } from '..';

const { Search } = Input;

interface FilterSuKienProps {
	value?: FilterSuKienValue;
	onChange?: (val: FilterSuKienValue) => void;
	onReload?: () => void;
	button?: JSX.Element;
	hideSelect?: boolean;
}

const FilterSuKien: React.FC<FilterSuKienProps> = ({ value, onChange, onReload, button, hideSelect }) => {
	return (
		<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
			<Space wrap>
				<Button className='btn-filter' icon={<FilterOutlined />} size='small' />

				<Search
					placeholder='Search activities (Name)'
					style={{ width: 280 }}
					allowClear
					value={value?.search}
					onSearch={(val) =>
						onChange?.({
							...value,
							search: val,
						})
					}
					onClear={() => {
						onChange?.({
							...value,
							search: undefined,
						});
					}}
					size='small'
				/>

				<MyDateRangePicker
					style={{ width: 250 }}
					value={value?.dateRange?.length === 2 ? [dayjs(value.dateRange[0]), dayjs(value.dateRange[1])] : null}
					onChange={(val) =>
						onChange?.({
							...value,
							dateRange: val ? [dayjs(val[0]), dayjs(val[1])] : [],
						})
					}
					ranges={{
						Today: [dayjs().startOf('day'), dayjs().endOf('day')],
						'This Week': [dayjs().startOf('week'), dayjs().endOf('week')],
						'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
						'Next Month': [dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month')],
					}}
					size='small'
					allowClear
				/>

				{!hideSelect && (
					<Select
						value={value?.regiStatus}
						style={{
							width: 200,
						}}
						placeholder='All Registration Status'
						options={[
							{ value: 'All', label: 'All' },
							{ value: 'Registered', label: 'Registered' },
							{ value: 'NotRegistered', label: 'Not registered' },
						]}
						allowClear
						size='small'
						onChange={(val) =>
							onChange?.({
								...value,
								regiStatus: val,
							})
						}
					/>
				)}
			</Space>

			<Space wrap>
				<Button icon={<ReloadOutlined />} onClick={onReload} />
				{button}
			</Space>
		</Flex>
	);
};

export default FilterSuKien;
