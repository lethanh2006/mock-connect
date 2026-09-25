import { IconFilter01, IconRotateArrow, SearchInput } from '@/components/Icons';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import Select from '@/components/MySelect';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { Flex, Space } from 'antd';
import dayjs from 'dayjs';
import { JSX, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { FilterSuKienValue } from '..';

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

	return (
		<Flex justify='space-between' align='center'>
			<Space wrap>
				<ButtonExtend icon={<IconFilter01 />} size='small' />

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

				<MyDateRangePicker
					style={{ width: 250, height: 36, background: 'none' }}
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
						style={{ width: 250, height: 36 }}
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
				<ButtonExtend icon={<IconRotateArrow />} onClick={onReload} />
				{button}
			</Space>
		</Flex>
	);
};

export default FilterSuKien;
