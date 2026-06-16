import { useMemo } from 'react';
import { useIntl } from 'umi';

export const useMessagesCalendar = () => {
	const intl = useIntl();

	return useMemo(
		() => ({
			allDay: intl.formatMessage({ id: 'lichsukien.calendar.allday' }),
			previous: intl.formatMessage({ id: 'lichsukien.calendar.previous' }),
			next: intl.formatMessage({ id: 'lichsukien.calendar.next' }),
			today: intl.formatMessage({ id: 'lichsukien.calendar.today' }),
			month: intl.formatMessage({ id: 'lichsukien.calendar.month' }),
			week: intl.formatMessage({ id: 'lichsukien.calendar.week' }),
			day: intl.formatMessage({ id: 'lichsukien.calendar.day' }),
			agenda: intl.formatMessage({ id: 'lichsukien.calendar.agenda' }),
			date: intl.formatMessage({ id: 'lichsukien.calendar.date' }),
			time: intl.formatMessage({ id: 'lichsukien.calendar.time' }),
			event: intl.formatMessage({ id: 'lichsukien.calendar.event' }),
			showMore: (total: number) => intl.formatMessage({ id: 'lichsukien.calendar.showmore' }, { total }),
			noEventsInRange: intl.formatMessage({ id: 'lichsukien.calendar.noeventsinrange' }),
		}),
		[intl],
	);
};
