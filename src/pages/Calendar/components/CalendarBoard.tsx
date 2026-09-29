import { IconChervolLeft, IconChervolRight, IconStar } from '@/components/Icons';
import { useMessagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { useEffect } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import '../style.less';

const localizer = dayjsLocalizer(dayjs);

export type CalendarNavigateAction = 'today' | 'previous' | 'next';
export type CalendarRange = [ReturnType<typeof dayjs>, ReturnType<typeof dayjs>];

const DEFAULT_VIEWS: View[] = [Views.MONTH, Views.WEEK, Views.DAY];

export const getEventLocation = (event: {
	loaiSuKien?: string;
	phongHoc?: string;
	phong?: { ma?: string };
	diaDiem?: string;
	assignment?: { tenLopHocPhan?: string };
	location?: string;
}) =>
	event.location ??
	(event.loaiSuKien === ELoaiSuKien.LICH_HOC
		? event.phongHoc
		: (event.phong?.ma ?? event.assignment?.tenLopHocPhan ?? event.diaDiem));

export const getCalendarDateRange = (nextDate: Date, view: View): CalendarRange => {
	if (view === Views.DAY) return [dayjs(nextDate).startOf('day'), dayjs(nextDate).endOf('day')];
	if (view === Views.WEEK) return [dayjs(nextDate).startOf('week'), dayjs(nextDate).endOf('week')];
	return [dayjs(nextDate).startOf('month'), dayjs(nextDate).endOf('month')];
};

export const shiftCalendarDate = (date: Date, view: View, action: CalendarNavigateAction): Date => {
	if (action === 'today') return new Date();

	const unit = view === Views.MONTH ? 'month' : view === Views.DAY ? 'day' : 'week';
	return action === 'next' ? dayjs(date).add(1, unit).toDate() : dayjs(date).subtract(1, unit).toDate();
};

type CalendarToolbarProps = {
	date: Date;
	view: View;
	dateRange?: CalendarRange;
	views?: View[];
	onNavigate: (action: CalendarNavigateAction) => void;
	onChangeView: (view: View) => void;
};

export const CalendarToolbar = ({
	date,
	view,
	dateRange,
	views = DEFAULT_VIEWS,
	onNavigate,
	onChangeView,
}: CalendarToolbarProps) => {
	const messagesCalendar = useMessagesCalendar();
	const range = dateRange ?? getCalendarDateRange(date, view);
	const viewingToday =
		view === Views.DAY
			? dayjs().isSame(date, 'day')
			: view === Views.WEEK
				? dayjs().isSame(date, 'week')
				: dayjs().isSame(date, 'month');

	const label =
		view === Views.DAY
			? formatDate(date, 'DD/MM')
			: view === Views.MONTH
				? formatDate(date, 'MM/YYYY')
				: `${formatDate(range[0], 'DD/MM')} - ${formatDate(range[1], 'DD/MM')}`;

	const viewLabel: Partial<Record<View, string>> = {
		[Views.MONTH]: messagesCalendar.month,
		[Views.WEEK]: messagesCalendar.week,
		[Views.DAY]: messagesCalendar.day,
	};

	return (
		<div className='calendar-toolbar'>
			<div className='calendar-toolbar__nav'>
				<div className='calendar-toolbar__arrows'>
					<button type='button' className='calendar-toolbar__icon-btn' onClick={() => onNavigate('previous')}>
						<IconChervolLeft size={20} />
					</button>
					<button type='button' className='calendar-toolbar__icon-btn' onClick={() => onNavigate('next')}>
						<IconChervolRight size={20} />
					</button>
				</div>
				<span className='calendar-toolbar__title'>{label}</span>
			</div>
			<div className='calendar-toolbar__actions'>
				<button
					type='button'
					className={`calendar-toolbar__today ${viewingToday ? 'is-current' : ''}`}
					onClick={() => onNavigate('today')}
					disabled={viewingToday}
				>
					{messagesCalendar.today}
				</button>
				<div className='calendar-toolbar__segments'>
					{views.map((item) => (
						<button
							key={item}
							type='button'
							className={`calendar-toolbar__segment ${view === item ? 'is-active' : ''}`}
							onClick={() => onChangeView(item)}
						>
							{viewLabel[item]}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

type CalendarBoardProps = {
	events: any[];
	date: Date;
	view: View;
	dateRange?: CalendarRange;
	onNavigate: (action: CalendarNavigateAction) => void;
	onChangeView: (view: View) => void;
	onCalendarNavigate?: (date: Date) => void;
	onRangeChange?: (range: Date[] | { start: Date; end: Date }) => void;
	onSelectEvent?: (event: any) => void;
	onSelectSlot?: (slot: any) => void;
	onShowMore?: (events: any[], date: Date) => void;
	selectable?: boolean;
	views?: View[];
	height?: number | string;
	calendarMinHeight?: number;
	popup?: boolean;
	surfaceMinHeight?: number;
};

const CalendarBoard = ({
	events,
	date,
	view,
	dateRange,
	onNavigate,
	onChangeView,
	onCalendarNavigate,
	onRangeChange,
	onSelectEvent,
	onSelectSlot,
	onShowMore,
	selectable = false,
	views = DEFAULT_VIEWS,
	height = 'calc(100vh - 240px)',
	calendarMinHeight,
	popup = false,
	surfaceMinHeight,
}: CalendarBoardProps) => {
	const messagesCalendar = useMessagesCalendar();
	const { record: recSetting, getSettingLich } = useModel('tienich.settinglich');

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const eventPropGetter = (event: { title?: string; loaiSuKien?: string; allDay?: boolean }) => {
		const isAllDay = Boolean(event.allDay) && view !== Views.MONTH;
		const backgroundColor =
			recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === event?.loaiSuKien)?.maMau ??
			ColorSuKien?.[event?.loaiSuKien as ELoaiSuKien];

		if (isAllDay) {
			return {
				className: 'is-allday',
				style: { backgroundColor: '#2E548A', color: '#ffffff', border: 'none' },
			};
		}

		return {
			className: 'is-timed',
			style: { backgroundColor, color: '#000000', border: 'none' },
		};
	};

	const eventCustom = ({ event }: { event: any }) => {
		const location = getEventLocation(event);

		if (event.allDay && view !== Views.MONTH) {
			return (
				<div className='calendar-allday-event'>
					<IconStar size={20} />
					<span>{event.title || '--'}</span>
				</div>
			);
		}

		if (view === Views.MONTH) {
			return <span className='calendar-tag__label'>{event.title || '--'}</span>;
		}

		return (
			<div className='calendar-event-card'>
				<div className='calendar-event-card__title'>{event.title || '--'}</div>
				{location ? <div className='calendar-event-card__location'>{location}</div> : null}
			</div>
		);
	};

	return (
		<div className='calendar-surface' style={surfaceMinHeight ? { minHeight: surfaceMinHeight } : undefined}>
			<CalendarToolbar
				date={date}
				view={view}
				dateRange={dateRange}
				views={views}
				onNavigate={onNavigate}
				onChangeView={onChangeView}
			/>
			<Calendar
				formats={{
					dayHeaderFormat: 'dddd DD/MM/YYYY',
					dayRangeHeaderFormat: (range: DateRange) =>
						`${formatDate(range.start, 'DD/MM')} - ${formatDate(range.end, 'DD/MM')}`,
					eventTimeRangeFormat: () => '',
				}}
				slotPropGetter={() => ({ style: { borderTop: 'none' } })}
				localizer={localizer}
				events={events}
				view={view}
				onView={onChangeView}
				onRangeChange={(val) => onRangeChange?.(val)}
				onNavigate={(newDate) => onCalendarNavigate?.(newDate)}
				selectable={selectable}
				scrollToTime={new Date(1970, 1, 1, 6)}
				date={date}
				messages={messagesCalendar}
				views={views}
				toolbar={false}
				style={{ height, minHeight: calendarMinHeight, overflow: 'auto' }}
				eventPropGetter={eventPropGetter}
				onSelectSlot={onSelectSlot}
				onSelectEvent={onSelectEvent}
				components={{
					event: eventCustom,
					timeGutterHeader: () => <span>{messagesCalendar.allDay}</span>,
				}}
				popup={popup}
				onShowMore={onShowMore}
			/>
		</div>
	);
};

export default CalendarBoard;
