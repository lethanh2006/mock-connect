import { messagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Card, Modal } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
const localizer = momentLocalizer(moment);

const ModalLichHoc = (props: { soLopHienThi: number }) => {
	const { visibleModal, setVisibleModal, danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');
	const [calendarView, setCalendarView] = useState<View>(Views.MONTH);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [date, setDate] = useState<Date>();
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	const getData = () => {
		const data = danhSachLopDangKy
			.map((item) =>
				(item.thoiKhoaBieuList ?? []).map((j) => ({
					title: `${item?.hocPhan?.ten || item?.maHocPhan} - ${item?.ten || ''}`,
					start: moment(j?.thoiGianBatDau).toDate(),
					end: moment(j?.thoiGianKetThuc).toDate(),
				})),
			)
			.flat();
		const start = _.minBy(data, (item) => item.start)?.start;
		const end = _.maxBy(data, (item) => item.end)?.end;
		setStartDate(start);
		setEndDate(end);
		setDate(start);

		setDataCalendar(data);
	};

	useEffect(() => {
		if (visibleModal) getData();
	}, [visibleModal]);

	const eventPropGetter = () => ({
		style: { backgroundColor: ColorSuKien?.[ELoaiSuKien.LICH_HOC] },
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title}</div>;
	};

	return (
		<Modal
			visible={visibleModal}
			onCancel={() => setVisibleModal(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
			bodyStyle={{ padding: 0 }}
		>
			<Card title='Lịch học dự kiến'>
				<p>
					Bạn đã đăng ký / đã chọn <b>{props.soLopHienThi} lớp tín chỉ</b>, tổng cộng có{' '}
					<b>{dataCalendar.length} ca học</b>, từ ngày {moment(startDate).format('DD/MM/YYYY')} đến ngày{' '}
					{moment(endDate).format('DD/MM/YYYY')}
					<br />
					Cụ thể như sau:
				</p>

				<Calendar
					formats={{
						dayRangeHeaderFormat: (range: DateRange) => {
							return `${moment(range.start).format('DD/MM')} - ${moment(range.end).format('DD/MM')}`;
						},
					}}
					localizer={localizer}
					events={dataCalendar}
					views={[Views.MONTH, Views.WEEK]}
					defaultView={Views.MONTH}
					view={calendarView}
					onView={(view) => setCalendarView(view)}
					defaultDate={new Date()}
					date={date}
					onNavigate={(newDate) => setDate(newDate)}
					selectable={false}
					messages={messagesCalendar}
					style={{ height: 700, overflow: 'auto' }}
					min={moment('0600', 'HHmm').toDate()}
					max={moment('2100', 'HHmm').toDate()}
					eventPropGetter={eventPropGetter}
					components={{ event: (event: any) => eventCustom(event) }}
					onShowMore={(events: any[], d) => {
						setCalendarView(Views.WEEK);
						setDate(d);
					}}
				/>
			</Card>
		</Modal>
	);
};

export default ModalLichHoc;
