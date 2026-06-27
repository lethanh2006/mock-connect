import { useMessagesCalendar } from '@/services/Calendar/constant';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { EHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { useEffect } from 'react';
import type { DateRange } from 'react-big-calendar';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';

const localizer = dayjsLocalizer(dayjs);

const CalendarLichHocLopHp = (props: {
	items: ThoiKhoaBieu.IRecord[];
	onClickItem: (val: ThoiKhoaBieu.IRecord) => void;
}) => {
	const { record: recSetting, getSettingLich } = useModel('tienich.settinglich');
	const messagesCalendar = useMessagesCalendar();
	const { items, onClickItem } = props;

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const eventPropGetter = (item: ThoiKhoaBieu.IRecord) => ({
		style: {
			backgroundColor:
				item.hinhThucGiangDay === EHinhThucGiangDay.ONLINE
					? '#4ba2e9b3'
					: (recSetting?.danhSachSettingLich?.find((i) => i?.loaiLich === ELoaiSuKien.LICH_HOC)?.maMau ??
						ColorSuKien?.[ELoaiSuKien.LICH_HOC]),
		},
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title}</div>;
	};

	return (
		<Calendar
			formats={{
				dayRangeHeaderFormat: (range: DateRange) => {
					return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
				},
				eventTimeRangeFormat: () => '',
			}}
			localizer={localizer}
			events={items.map((j) => ({
				...j,
				title: j.tenLopHocPhan,
				start: dayjs(j?.thoiGianBatDau).toDate(),
				end: dayjs(j?.thoiGianKetThuc).toDate(),
			}))}
			views={[Views.MONTH, Views.WEEK]}
			defaultView={Views.MONTH}
			defaultDate={new Date()}
			messages={messagesCalendar}
			style={{ height: 540, overflow: 'auto' }}
			min={dayjs('0600', 'HHmm').toDate()}
			max={dayjs('2100', 'HHmm').toDate()}
			eventPropGetter={eventPropGetter}
			components={{ event: (event: any) => eventCustom(event) }}
			onSelectEvent={(rec: any) => onClickItem(rec)}
		/>
	);
};

export default CalendarLichHocLopHp;
