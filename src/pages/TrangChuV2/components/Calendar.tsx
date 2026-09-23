import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/PageCard';
import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ELoaiSuKien, LoaiSuKienLocaleKey } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link, useIntl, useModel } from 'umi';

type CalendarEvent = {
	_id?: string;
	title?: string;
	tenSuKien?: string;
	loaiSuKien?: ELoaiSuKien;
	thoiGianBatDau?: string | Date;
	thoiGianKetThuc?: string | Date;
	start?: string | Date;
	end?: string | Date;
	location?: string | null;
	suffix?: string | null;
	diaDiem?: string | null;
	allDay?: boolean;
	isLichDktc?: boolean;
	hinhThucGiangDay?: EHinhThucGiangDay | string;
	ngayHienThi?: string;
};

const getEventLocation = (event: CalendarEvent) => event.location ?? event.suffix ?? event.diaDiem;

const EVENT_LINE_COLOR = '#134D8B';

// ELoaiSuKien.CA_NHAN đang bị tắt trên main nên mọi loại dùng chung một màu nền
const getEventTagBackground = (_loaiSuKien?: ELoaiSuKien) => 'rgba(19, 77, 139, 0.12)';

const CardCalendar = () => {
	const intl = useIntl();
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(false);
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
	const [dateRange] = useState([dayjs().startOf('day'), dayjs().endOf('day')]);
	// const { getSuKienTrongKhoangModel } = useModel('sukien.sukien');
	const { getTrongKhoangModel } = useModel('daotao.thoikhoabieu');
	// const { getTrongKhoangModel: getLichThiModel } = useModel('khaothi.lichthi');
	// const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { getLichDangKyTinChiTrongKhoangModel } = useModel('daotao.dotdangkytinchi');
	const { record: recSetting, getSettingLich } = useModel('tienich.settinglich');

	const timeRange = {
		fromDate: dateRange[0].toISOString(),
		toDate: dateRange[1].toISOString(),
	};

	const getThoiKhoaBieu = async (): Promise<CalendarEvent[]> =>
		getTrongKhoangModel(timeRange).then((data) =>
			data.map((item) => ({
				...item,
				title: item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || '',
				location: item.phongHoc,
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			})),
		);

	// const getLichThi = async (): Promise<CalendarEvent[]> =>
	// 	getLichThiModel(timeRange).then((data) =>
	// 		data.map((item) => ({
	// 			...item,
	// 			title: item.danhSachHocPhan?.map((i) => i.ten)?.join(', ') || '',
	// 			location: item.phong?.ma,
	// 			loaiSuKien: ELoaiSuKien.CHUNG,
	// 		})),
	// 	);

	// const getSuKien = async (): Promise<CalendarEvent[]> =>
	// 	getSuKienTrongKhoangModel(timeRange).then((data) =>
	// 		data.map((item) => ({
	// 			...item,
	// 			title: item?.tenSuKien ?? '',
	// 			location: item?.diaDiem,
	// 		})),
	// 	);

	// const getBaiTap = async (): Promise<CalendarEvent[]> =>
	// 	thongKeBaiTapModel(timeRange.fromDate, timeRange.toDate).then((data) =>
	// 		data.map((item) => ({
	// 			...item,
	// 			title: item?.assignment?.noiDung ?? '',
	// 			location: item?.assignment?.tenLopHocPhan,
	// 			thoiGianBatDau: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
	// 			thoiGianKetThuc: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
	// 			loaiSuKien: ELoaiSuKien.CHUNG,
	// 		})),
	// 	);

	const getLichDKtc = async (): Promise<CalendarEvent[]> =>
		getLichDangKyTinChiTrongKhoangModel({
			fromDate: dateRange[0].subtract(1, 'year').toISOString(),
			toDate: dateRange[1].add(1, 'year').toISOString(),
		}).then((data) =>
			data.map((item) => {
				const title = intl.formatMessage({ id: 'lichsukien.dangky_tinchi.title' }, { ten: item?.ten ?? '' });

				return {
					...item,
					title,
					tenSuKien: title,
					loaiSuKien: ELoaiSuKien.CHUNG,
					isLichDktc: true,
					allDay: true,
					thoiGianBatDau: dayjs(item?.thoiGianBatDau).startOf('day').toDate(),
					thoiGianKetThuc: dayjs(item?.thoiGianKetThuc).endOf('day').toDate(),
				};
			}),
		);

	const getData = () => {
		setLoading(true);
		Promise.allSettled([getThoiKhoaBieu(), getLichDKtc()])
			.then((values) => {
				const data = values
					.filter((item) => item.status === 'fulfilled')
					.map((item: PromiseFulfilledResult<CalendarEvent[]>) => item.value)
					.flat()
					.filter((item) => item?.thoiGianBatDau ?? item?.start)
					.sort((a, b) => dayjs(a.thoiGianBatDau ?? a.start).valueOf() - dayjs(b.thoiGianBatDau ?? b.start).valueOf());
				setEvents(data);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const handleEventClick = (event: CalendarEvent) => {
		setSelectedEvent(event);
		setVisibleDetail(true);
	};

	const getEventTypeLabel = (event: CalendarEvent) => {
		const localeKey = event.loaiSuKien ? LoaiSuKienLocaleKey[event.loaiSuKien] : undefined;
		return localeKey ? intl.formatMessage({ id: localeKey }) : event.loaiSuKien;
	};

	const getEventTimes = (event: CalendarEvent) => {
		const thoiGianBatDau = event.thoiGianBatDau ?? event.start;
		const thoiGianKetThuc = event.thoiGianKetThuc ?? event.end;

		if (!thoiGianBatDau) return { start: '--', end: '' };

		const isMultiDay = thoiGianKetThuc && !dayjs(thoiGianBatDau).isSame(dayjs(thoiGianKetThuc), 'day');
		if (event.allDay || event.isLichDktc || isMultiDay) {
			return {
				start: formatDate(event.ngayHienThi ?? thoiGianBatDau, 'DD/MM'),
				end: thoiGianKetThuc && isMultiDay ? formatDate(thoiGianKetThuc, 'DD/MM') : '',
			};
		}

		return {
			start: formatDate(thoiGianBatDau, 'HH:mm'),
			end: thoiGianKetThuc ? formatDate(thoiGianKetThuc, 'HH:mm') : '',
		};
	};

	const renderContent = () => {
		const data = sortBy(
			events
				?.filter((event) => {
					const thoiGianBatDau = event.thoiGianBatDau ?? event.start;
					const thoiGianKetThuc = event.thoiGianKetThuc ?? event.end ?? event.thoiGianBatDau ?? event.start;

					return (
						thoiGianBatDau &&
						thoiGianKetThuc &&
						dayjs(thoiGianBatDau).isSameOrBefore(dateRange[1], 'day') &&
						dayjs(thoiGianKetThuc).isSameOrAfter(dateRange[0], 'day')
					);
				})
				?.map((event) => ({
					...event,
					ngayHienThi: dateRange[0].toISOString(),
					tenSuKien: event.title ?? event.tenSuKien,
					suffix: event.location ?? event.suffix ?? event.diaDiem,
				})),
			(suKien) => new Date(suKien.thoiGianBatDau ?? suKien.start ?? ''),
		);

		return (
			<div className={!loading && isEmpty(data) ? 'dashboard_calendar is-empty' : 'dashboard_calendar'}>
				{!loading && isEmpty(data) ? (
					<EmptyState description={intl.formatMessage({ id: 'lichsukien.empty' })} compact />
				) : null}
				{data.map((sukien, index) => {
					const location = getEventLocation(sukien);
					const eventTypeLabel = getEventTypeLabel(sukien);
					const { start, end } = getEventTimes(sukien);
					const lineColor =
						recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ||
						EVENT_LINE_COLOR;

					return (
						<div
							key={`${sukien._id ?? sukien.title}-${sukien.ngayHienThi ?? sukien.thoiGianBatDau ?? sukien.start}`}
							className='su_kien'
							onClick={() => handleEventClick(sukien)}
						>
							<div className='su_kien__time'>
								<span className='su_kien__start'>{start}</span>
								{end ? <span className='su_kien__end'>{end}</span> : null}
							</div>
							<span className='su_kien__mark' style={{ background: lineColor }} aria-hidden />
							<div className='su_kien__body'>
								<div className='su_kien__title'>{sukien.tenSuKien ?? sukien.title ?? ''}</div>
								{location ? (
									<div className='su_kien__location'>
										<span>{location}</span>
									</div>
								) : null}
							</div>
							{eventTypeLabel ? (
								<span className='su_kien__label' style={{ background: getEventTagBackground(sukien.loaiSuKien) }}>
									{eventTypeLabel}
								</span>
							) : null}
							{index < data.length - 1 ? <div className='su_kien__line' /> : null}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			<Card
				className='vin-dashboard-card'
				loading={loading}
				title={
					<>
						{intl.formatMessage({ id: 'trangchu.lich.title' })}
						<span className='calendar-card-date'>{dayjs().format('DD/MM/YYYY')}</span>
					</>
				}
				headerType='button-text'
				extra={<Link to='/my-calendar'>{intl.formatMessage({ id: 'trangchu.lich.xemthem' })}</Link>}
				styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
			>
				<div className='calendar-body'>{renderContent()}</div>
			</Card>
			<ModalViewDetailCalendar
				visible={visibleDetail}
				setVisible={setVisibleDetail}
				getData={getData}
				event={selectedEvent}
			/>
		</>
	);
};

export default CardCalendar;
