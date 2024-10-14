import { messagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import moment from 'moment';
import { useEffect } from 'react';
import type { DateRange } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
const localizer = momentLocalizer(moment);

const CalendarLichHocLopHp = () => {
	const { setVisibleForm, danhSach, setRecord } = useModel('daotao.thoikhoabieu');
	const { record: recSetting, getSettingLich } = useModel('tienich.settinglich');

	useEffect(() => {
		getSettingLich();
	}, []);

	const eventPropGetter = () => ({
		style: {
			backgroundColor:
				recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_HOC)?.maMau ??
				ColorSuKien?.[ELoaiSuKien.LICH_HOC],
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
					return `${moment(range.start).format('DD/MM')} - ${moment(range.end).format('DD/MM')}`;
				},
			}}
			localizer={localizer}
			events={danhSach.map((j) => ({
				...j,
				title: j.tenLopHocPhan,
				start: moment(j?.thoiGianBatDau).toDate(),
				end: moment(j?.thoiGianKetThuc).toDate(),
			}))}
			views={[Views.MONTH, Views.WEEK]}
			defaultView={Views.MONTH}
			defaultDate={new Date()}
			messages={messagesCalendar}
			style={{ height: 540, overflow: 'auto' }}
			min={moment('0600', 'HHmm').toDate()}
			max={moment('2100', 'HHmm').toDate()}
			eventPropGetter={eventPropGetter}
			components={{ event: (event: any) => eventCustom(event) }}
			onSelectEvent={(rec: any) => {
				setRecord(rec);
				setVisibleForm(true);
			}}
		/>
	);
};

export default CalendarLichHocLopHp;
