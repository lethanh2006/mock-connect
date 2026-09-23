import ModalExpandable from '@/components/Table/ModalExpandable';
import CalendarBoard, { shiftCalendarDate } from '@/pages/Calendar/components/CalendarBoard';
import { ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import type { View } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import { useIntl, useModel } from 'umi';
import ModalChiTietBuoiHoc, { type CalendarLichHocEvent } from './ModalChiTietBuoiHoc';

const ModalLichHoc = (props: { soLopHienThi: number }) => {
	const intl = useIntl();
	const { visibleModal, setVisibleModal, danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [calendarData, setCalendarData] = useState<{
		dataCalendar: CalendarLichHocEvent[];
		ready: boolean;
		date?: Date;
		startDate?: Date;
		endDate?: Date;
	}>({ dataCalendar: [], ready: false });
	const [date, setDate] = useState<Date>();
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<CalendarLichHocEvent | undefined>();

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
					start: dayjs(j?.thoiGianBatDau).toDate(),
					end: dayjs(j?.thoiGianKetThuc).toDate(),
					location: j?.phongHoc ?? '',
					loaiSuKien: ELoaiSuKien.LICH_HOC,
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
			setCalendarData((prev: typeof calendarData) => ({
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

	const calendarDate = date ?? new Date();

	return (
		<ModalExpandable
			open={visibleModal}
			onCancel={() => setVisibleModal(false)}
			footer={null}
			width={1200}
			title={intl.formatMessage({ id: 'dangkytinchi.modallichhoc.title' })}
		>
			{visibleModal ? (
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

					<CalendarBoard
						events={calendarData.dataCalendar}
						date={calendarDate}
						view={calendarView}
						onNavigate={(action) => setDate(shiftCalendarDate(calendarDate, calendarView, action))}
						onChangeView={(view) => setCalendarView(view)}
						onCalendarNavigate={(newDate) => setDate(newDate)}
						onSelectEvent={(event) => {
							setSelectedEvent(event as CalendarLichHocEvent);
							setVisibleDetail(true);
						}}
						onShowMore={(_events, selectedDate) => {
							setCalendarView(Views.WEEK);
							setDate(selectedDate);
						}}
						height={560}
						surfaceMinHeight={560}
					/>
				</Spin>
			) : null}

			<ModalChiTietBuoiHoc visible={visibleDetail} setVisible={setVisibleDetail} event={selectedEvent} />
		</ModalExpandable>
	);
};

export default ModalLichHoc;
