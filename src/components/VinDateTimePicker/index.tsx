import { DateTimePicker, UiProvider, useResolvedTheme } from '@/components/Icons';
import dayjs from '@/utils/dayjs';
import { CalendarDateTime } from '@internationalized/date';
import type { Dayjs } from 'dayjs';

const toCalendarDateTime = (value?: Dayjs | null) =>
	value && value.isValid()
		? new CalendarDateTime(value.year(), value.month() + 1, value.date(), value.hour(), value.minute())
		: null;

const VinDateTimePicker = (props: {
	id?: string;
	value?: string | Dayjs | null;
	onChange?: (value: string | null) => void;
	min?: Dayjs;
	max?: Dayjs;
	disabled?: boolean;
	allowClear?: boolean;
	className?: string;
}) => {
	const { id, value, onChange, min, max, disabled, allowClear = false, className } = props;
	const theme = useResolvedTheme();

	return (
		<UiProvider theme={theme} style={{ width: '100%', minHeight: 0 }}>
			<DateTimePicker
				id={id}
				className={className}
				value={toCalendarDateTime(value ? dayjs(value) : null)}
				onChange={(next) => {
					if (!next) {
						onChange?.(null);
						return;
					}
					const picked = dayjs(new Date(next.year, next.month - 1, next.day, next.hour, next.minute));
					if (min && picked.isBefore(min, 'minute')) return;
					if (max && picked.isAfter(max, 'minute')) return;
					onChange?.(picked.toISOString());
				}}
				minValue={toCalendarDateTime(min) ?? undefined}
				maxValue={toCalendarDateTime(max) ?? undefined}
				isDisabled={disabled}
				isClearable={allowClear}
				granularity='minute'
				hourCycle={24}
			/>
		</UiProvider>
	);
};

export default VinDateTimePicker;
