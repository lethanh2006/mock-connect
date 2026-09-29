import { DateRangePicker, IconRotateArrow, SearchInput } from '@/components/Icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import VinSelect from '@/components/VinSelect';
import { CalendarDate } from '@internationalized/date';
import { Flex, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { JSX, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { FilterSuKienValue } from '..';

const toCalendarDate = (value: Dayjs) => new CalendarDate(value.year(), value.month() + 1, value.date());
const fromCalendarDate = (value: CalendarDate) => {
	const now = dayjs();
	return dayjs(
		new Date(value.year, value.month - 1, value.day, now.hour(), now.minute(), now.second(), now.millisecond()),
	);
};

interface FilterSuKienProps {
	value?: FilterSuKienValue;
	onChange?: (val: FilterSuKienValue) => void;
	onReload?: () => void;
	button?: JSX.Element;
	hideSelect?: boolean;
}

const FilterSuKien: React.FC<FilterSuKienProps> = ({ value, onChange, onReload, button, hideSelect }) => {
	const intl = useIntl();
	const [keyword, setKeyword] = useState(value?.search ?? '');

	useEffect(() => {
		setKeyword(value?.search ?? '');
	}, [value?.search]);

	const presetRanges = [
		{ id: 'today', start: dayjs().startOf('day'), end: dayjs().endOf('day') },
		{ id: 'week', start: dayjs().startOf('week'), end: dayjs().endOf('week') },
		{ id: 'month', start: dayjs().startOf('month'), end: dayjs().endOf('month') },
		{ id: 'next', start: dayjs().add(1, 'month').startOf('month'), end: dayjs().add(1, 'month').endOf('month') },
	];

	return (
		<Flex className='filter-bar' justify='space-between' align='center'>
			<Space wrap>
				{/* <ButtonExtend icon={<IconFilter01 />} size='small' /> */}

				<div className='search-input-custom-sm'>
					<SearchInput
						variant='tiled'
						size='small'
						clearable
						value={keyword}
						placeholder={intl.formatMessage({ id: 'activity.filter.name' })}
						onChange={(e) => setKeyword(e.target.value)}
						onKeyDown={(e) => {
							if (e.key !== 'Enter') return;
							const next = (e.target as HTMLInputElement).value.trim();
							onChange?.({
								...value,
								search: next || undefined,
							});
						}}
						onClear={() => {
							setKeyword('');
							onChange?.({
								...value,
								search: undefined,
							});
						}}
					/>
				</div>

				<DateRangePicker
					aria-label={intl.formatMessage({ id: 'activity.filter.dateRange' })}
					className='field-w-450'
					fieldClassName='h-9'
					rangeSeparator='-'
					value={
						value?.dateRange?.length === 2
							? { start: toCalendarDate(dayjs(value.dateRange[0])), end: toCalendarDate(dayjs(value.dateRange[1])) }
							: null
					}
					onChange={(range) =>
						onChange?.({
							...value,
							dateRange: (() => {
								if (!range) return [];
								const start = fromCalendarDate(range.start);
								const end = fromCalendarDate(range.end);
								const preset = presetRanges.find(
									(item) => item.start.isSame(start, 'day') && item.end.isSame(end, 'day'),
								);
								return preset ? [preset.start, preset.end] : [start, end];
							})(),
						})
					}
					presets={presetRanges.map((item) => ({
						label: intl.formatMessage({ id: `activity.filter.${item.id}` }),
						value: () => ({ start: toCalendarDate(item.start), end: toCalendarDate(item.end) }),
					}))}
					isClearable
				/>

				{!hideSelect && (
					<VinSelect
						value={value?.regiStatus}
						className='field-w-250'
						size='sm'
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
						onChange={(val) =>
							onChange?.({
								...value,
								regiStatus: val as FilterSuKienValue['regiStatus'],
							})
						}
					/>
				)}
			</Space>

			<Space wrap>
				<ButtonExtend icon={<IconRotateArrow />} onClick={onReload} />
				{button}
			</Space>
		</Flex>
	);
};

export default FilterSuKien;
