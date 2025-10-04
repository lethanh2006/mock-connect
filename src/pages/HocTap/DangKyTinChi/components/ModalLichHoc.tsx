import { messagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { Card, Modal } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';

const localizer = dayjsLocalizer(dayjs);

const ModalLichHoc = (props: { soLopHienThi: number }) => {
	const { visibleModal, setVisibleModal, danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');
	const { record: recSetting, getSettingLich } = useModel('tienich.settinglich');
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [date, setDate] = useState<Date>();
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const getData = () => {
		const data = danhSachLopDangKy
			.map((item) =>
				(item.thoiKhoaBieuList ?? []).map((j) => ({
					title: `${item?.hocPhan?.ten || item?.maHocPhan} - ${item?.ten || ''}`,
					start: dayjs(j?.thoiGianBatDau).toDate(),
					end: dayjs(j?.thoiGianKetThuc).toDate(),
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
		<Modal
			open={visibleModal}
			onCancel={() => setVisibleModal(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
			styles={{ body: { padding: 0 } }}
		>
			<Card title='Lịch học dự kiến'>
				<p>
					Bạn đã đăng ký / đã chọn <b>{props.soLopHienThi} lớp tín chỉ</b>, tổng cộng có{' '}
					<b>{dataCalendar.length} buổi học</b>, từ ngày {dayjs(startDate).format('DD/MM/YYYY')} đến ngày{' '}
					{dayjs(endDate).format('DD/MM/YYYY')}
					<br />
					Cụ thể như sau:
				</p>

				<Calendar
					formats={{
						dayRangeHeaderFormat: (range: DateRange) => {
							return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
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
					style={{ height: 600, overflow: 'auto' }}
					min={dayjs('0600', 'HHmm').toDate()}
					max={dayjs('2100', 'HHmm').toDate()}
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
