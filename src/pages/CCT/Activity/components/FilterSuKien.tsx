import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Flex, Input, Select, Space } from 'antd';
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
				<ButtonExtend className='btn-filter' icon={<FilterOutlined />} size='small' />

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
						'Hôm nay': [dayjs().startOf('date'), dayjs().endOf('date')],
						'Tuần này': [dayjs().startOf('week'), dayjs().endOf('week')],
						'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
					}}
					size='small'
				/>

				{!hideSelect && (
					<Select
						// value={'all'}
						style={{
							width: 200,
						}}
						placeholder='All Registration Status'
						options={[
							{ value: 'all', label: 'All' },
							{ value: 'registered', label: 'Registered' },
							{ value: 'not_registered', label: 'Not registered' },
						]}
						allowClear
						size='small'
					/>
				)}
			</Space>

			<Space wrap>
				<ButtonExtend icon={<ReloadOutlined />} onClick={onReload} />
				{button}
			</Space>
		</Flex>
	);
};

export default FilterSuKien;
