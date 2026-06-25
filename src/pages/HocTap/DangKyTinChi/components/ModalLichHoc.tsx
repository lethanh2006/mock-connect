import ModalExpandable from '@/components/Table/ModalExpandable';
import { useMessagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl, useModel } from 'umi';
import ModalChiTietBuoiHoc, { type CalendarLichHocEvent } from './ModalChiTietBuoiHoc';

const localizer = dayjsLocalizer(dayjs);

const ModalLichHoc = (props: { soLopHienThi: number }) => {
	const intl = useIntl();
	const messagesCalendar = useMessagesCalendar();
	const { visibleModal, setVisibleModal, danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [calendarData, setCalendarData] = useState<{
		dataCalendar: CalendarLichHocEvent[];
		date?: Date;
		startDate?: Date;
		endDate?: Date;
		ready: boolean;
	}>({
		dataCalendar: [],
		ready: false,
	});
	const [selectedEvent, setSelectedEvent] = useState<CalendarLichHocEvent>();
	const [visibleDetail, setVisibleDetail] = useState(false);

	// useEffect(() => {
	// 	if (!recSetting?._id) getSettingLich();
	// }, []);

	useEffect(() => {
		if (!visibleModal) {
			setCalendarData({ dataCalendar: [], ready: false });
			setSelectedEvent(undefined);
			setVisibleDetail(false);
			return undefined;
		}

		let classIndex = 0;
		let frameId = 0;
		let startDate: Date | undefined;
		let endDate: Date | undefined;
		let cancelled = false;

		setCalendarData({ dataCalendar: [], ready: false });

		const buildEventsFromClasses = (classes: typeof danhSachLopDangKy) =>
			classes.flatMap((item) =>
				(item.thoiKhoaBieuList ?? []).map((j) => ({
					title: `${item?.hocPhan?.ten || item?.maHocPhan} - ${item?.ten || ''}`,
					start: new Date(j?.thoiGianBatDau ?? ''),
					end: new Date(j?.thoiGianKetThuc ?? ''),
					lopHocPhan: item,
					tkb: j,
				})),
			);

		const processBatch = () => {
			if (cancelled) return;

			const nextIndex = Math.min(classIndex + 5, danhSachLopDangKy.length);
			const batch: CalendarLichHocEvent[] = buildEventsFromClasses(danhSachLopDangKy.slice(classIndex, nextIndex));
			classIndex = nextIndex;

			batch.forEach(({ start, end }) => {
				if (!startDate || start < startDate) startDate = start;
				if (!endDate || end > endDate) endDate = end;
			});

			const ready = classIndex >= danhSachLopDangKy.length;
			setCalendarData((prev) => ({
				dataCalendar: batch.length ? [...prev.dataCalendar, ...batch] : prev.dataCalendar,
				date: prev.date ?? startDate,
				startDate,
				endDate,
				ready,
			}));

			if (ready) console.timeEnd('build');
			else frameId = window.requestAnimationFrame(processBatch);
		};

		frameId = window.requestAnimationFrame(processBatch);

		return () => {
			cancelled = true;
			window.cancelAnimationFrame(frameId);
		};
	}, [visibleModal, danhSachLopDangKy]);

	const eventPropGetter = () => ({
		style: {
			backgroundColor:
				recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === ELoaiSuKien.LICH_HOC)?.maMau ??
				ColorSuKien?.[ELoaiSuKien.LICH_HOC],
			cursor: 'pointer',
		},
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title}</div>;
	};

	return (
		<ModalExpandable
			open={visibleModal}
			onCancel={() => setVisibleModal(false)}
			okButtonProps={{ hidden: true }}
			cancelText={intl.formatMessage({ id: 'dangkytinchi.action.dong' })}
			width={1000}
			styles={{ body: { padding: 0 } }}
		>
			{visibleModal ? (
				<Card title={intl.formatMessage({ id: 'dangkytinchi.modallichhoc.title' })}>
					<Spin spinning={!calendarData.ready}>
						<p>
							{intl.formatMessage(
								{ id: 'dangkytinchi.modallichhoc.description.dangkyloptinchi' },
								{
									countLop: props.soLopHienThi,
									countBuoi: calendarData.dataCalendar.length,
									start: formatDate(calendarData.startDate),
									end: formatDate(calendarData.endDate),

									b: (chunks: any) => <b>{chunks}</b>,
								},
							)}
							<br />
							{intl.formatMessage({
								id: 'dangkytinchi.modallichhoc.description.cuthenhusau',
							})}
						</p>

						{calendarData.ready || calendarData.dataCalendar.length ? (
							<Calendar
								formats={{
									dayRangeHeaderFormat: (range: DateRange) => {
										return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
									},
									eventTimeRangeFormat: () => '',
								}}
								localizer={localizer}
								events={calendarData.dataCalendar}
								views={[Views.MONTH, Views.WEEK]}
								defaultView={Views.MONTH}
								view={calendarView}
								onView={(view) => setCalendarView(view)}
								defaultDate={new Date()}
								date={calendarData.date}
								onNavigate={(newDate) => setCalendarData((prev) => ({ ...prev, date: newDate }))}
								selectable={false}
								messages={messagesCalendar}
								style={{ height: 600, overflow: 'auto' }}
								min={dayjs('0600', 'HHmm').toDate()}
								max={dayjs('2100', 'HHmm').toDate()}
								eventPropGetter={eventPropGetter}
								components={{ event: (event: any) => eventCustom(event) }}
								onSelectEvent={(event: CalendarLichHocEvent) => {
									setSelectedEvent(event);
									setVisibleDetail(true);
								}}
								onShowMore={(events: any[], d) => {
									setCalendarView(Views.WEEK);
									setCalendarData((prev) => ({ ...prev, date: d }));
								}}
							/>
						) : (
							<div style={{ height: 600 }} />
						)}
					</Spin>
				</Card>
			) : null}

			<ModalChiTietBuoiHoc visible={visibleDetail} setVisible={setVisibleDetail} event={selectedEvent} />
		</ModalExpandable>
	);
};

export default ModalLichHoc;
