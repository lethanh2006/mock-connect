import { IconBookOpen, IconCalendarStar, IconHuman } from '@/components/Icons';
import { ELoaiSuKien, ELoaiSuKienKhac, LoaiSuKienLocaleKey } from '@/services/SuKien/constant';
import type { ComponentType } from 'react';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'umi';

type FilterIcon = ComponentType<{ size?: number; color?: string }>;

export const FILTER_VISUAL: Partial<Record<ELoaiSuKien | ELoaiSuKienKhac, { color: string; Icon: FilterIcon }>> = {
	[ELoaiSuKien.CHUNG]: { color: '#FF981B', Icon: IconCalendarStar },
	[ELoaiSuKien.LICH_HOC]: { color: 'rgba(19, 77, 139, 0.9)', Icon: IconBookOpen },
	// 	[ELoaiSuKien.LICH_THI]: { color: '#E55B62', Icon: IconStar },
	// 	[ELoaiSuKien.BAI_TAP]: { color: '#E279F4', Icon: IconHeart },
	// 	[ELoaiSuKien.HOP_LOP]: { color: '#000000', Icon: IconHuman },
	// 	[ELoaiSuKien.CA_NHAN]: { color: '#E55B62', Icon: IconStar },
	// 	[ELoaiSuKienKhac.KHAC]: { color: '#000000', Icon: IconHuman },
};

export const DEFAULT_FILTER_VISUAL = { color: '#000000', Icon: IconHuman as FilterIcon };

export const EVENT_TYPE_TAG: Partial<Record<ELoaiSuKien | ELoaiSuKienKhac, string>> = {
	[ELoaiSuKien.LICH_HOC]: 'rgba(19, 77, 139, 0.12)',
	// 	[ELoaiSuKien.HOP_LOP]: 'rgba(19, 77, 139, 0.12)',
	[ELoaiSuKien.CHUNG]: 'rgba(255, 152, 27, 0.2)',
	// 	[ELoaiSuKien.BAI_TAP]: 'rgba(226, 121, 244, 0.3)',
	// 	[ELoaiSuKien.LICH_THI]: 'rgba(229, 91, 98, 0.16)',
	// 	[ELoaiSuKien.CA_NHAN]: 'rgba(0, 0, 0, 0.05)',
	// 	[ELoaiSuKienKhac.KHAC]: 'rgba(0, 0, 0, 0.05)',
};

export const STATUS_TONE = {
	success: { background: 'rgba(22, 163, 74, 0.15)', color: '#16A34A' },
	warning: { background: 'rgba(255, 152, 27, 0.2)', color: '#C2410C' },
	danger: { background: 'rgba(220, 38, 38, 0.12)', color: '#DC2626' },
	neutral: { background: 'rgba(0, 0, 0, 0.05)', color: 'rgba(0, 0, 0, 0.6)' },
};

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

export const useLoaiSuKienLabel = () => {
	const intl = useIntl();

	return useCallback(
		(loai: ELoaiSuKien | ELoaiSuKienKhac | string) => {
			const localeKey = LoaiSuKienLocaleKey[loai as ELoaiSuKien | ELoaiSuKienKhac];
			return localeKey ? intl.formatMessage({ id: localeKey }) : String(loai);
		},
		[intl],
	);
};
