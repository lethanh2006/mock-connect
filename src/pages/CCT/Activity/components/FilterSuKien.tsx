import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { Button, IconFilter01, IconRotateArrow } from '@/components/Icons';
import Select from '@/components/MySelect';
import { Flex, Input, Space } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useIntl } from 'umi';
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
	const intl = useIntl();

	return (
		<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
			<Space wrap>
				<Button variant='outline' className='btn-filter' icon={<IconFilter01 />} size='sm' />

				<Search
					placeholder={intl.formatMessage({ id: 'activity.filter.name' })}
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
						[intl.formatMessage({ id: 'activity.filter.today' })]: [dayjs().startOf('day'), dayjs().endOf('day')],
						[intl.formatMessage({ id: 'activity.filter.week' })]: [dayjs().startOf('week'), dayjs().endOf('week')],
						[intl.formatMessage({ id: 'activity.filter.month' })]: [dayjs().startOf('month'), dayjs().endOf('month')],
						[intl.formatMessage({ id: 'activity.filter.next' })]: [
							dayjs().add(1, 'month').startOf('month'),
							dayjs().add(1, 'month').endOf('month'),
						],
					}}
					size='small'
					allowClear
				/>

				{!hideSelect && (
					<Select
						value={value?.regiStatus}
						style={{ width: 200 }}
						placeholder={intl.formatMessage({ id: 'activity.filter.trangthai' })}
						options={[
							{
								value: 'All',
								label: intl.formatMessage({ id: 'activity.filter.tatca' }),
							},
							{
								value: 'Registered',
								label: intl.formatMessage({ id: 'activity.filter.dangky' }),
							},
							{
								value: 'NotRegistered',
								label: intl.formatMessage({ id: 'activity.filter.chuadangky' }),
							},
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
				<Button variant='outline' icon={<IconRotateArrow />} onClick={onReload} />
				{button}
			</Space>
		</Flex>
	);
};

export default FilterSuKien;
