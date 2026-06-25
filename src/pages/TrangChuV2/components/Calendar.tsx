import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { colorHinhThucGiangDay, EHinhThucGiangDay, mapHinhThucGiangDayI18n } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, LoaiSuKienLocaleKey } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { EnvironmentOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Empty, Flex, Space, Tag } from 'antd';
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

	const renderListEventTime = (event: CalendarEvent) => {
		const thoiGianBatDau = event.thoiGianBatDau ?? event.start;
		const thoiGianKetThuc = event.thoiGianKetThuc ?? event.end;
		const ngayHienThi = event.ngayHienThi;

		if (!thoiGianBatDau) return '--';

		const isMultiDay = thoiGianKetThuc && !dayjs(thoiGianBatDau).isSame(dayjs(thoiGianKetThuc), 'day');
		if (event.allDay || event.isLichDktc || isMultiDay) {
			return formatDate(ngayHienThi ?? thoiGianBatDau, 'DD/MM');
		}

		return formatDate(thoiGianBatDau, 'HH:mm');
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
			<div className='dashboard_calendar'>
				{!loading && isEmpty(data) ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.formatMessage({ id: 'lichsukien.empty' })} />
				) : null}
				{data.map((sukien) => {
					const location = getEventLocation(sukien);
					const eventTypeLabel = getEventTypeLabel(sukien);
					return (
						<div
							key={`${sukien._id ?? sukien.title}-${sukien.ngayHienThi ?? sukien.thoiGianBatDau ?? sukien.start}`}
							className='su_kien today'
							onClick={() => handleEventClick(sukien)}
						>
							<div className='su_kien__left'>
								<div className='su_kien__thoi_gian' style={{ color: '#0E50CF' }}>
									{renderListEventTime(sukien)}
								</div>
							</div>
							<div
								className='su_kien__right'
								style={{
									borderColor:
										recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ??
										ColorSuKien[sukien.loaiSuKien as ELoaiSuKien],
								}}
							>
								<div className='su_kien__title'>
									{sukien.tenSuKien ?? sukien.title ?? ''}
									{sukien.loaiSuKien === ELoaiSuKien.LICH_HOC &&
										sukien.hinhThucGiangDay === EHinhThucGiangDay.ONLINE && (
											<Tag
												color={colorHinhThucGiangDay[sukien.hinhThucGiangDay as EHinhThucGiangDay]}
												style={{ marginLeft: 8 }}
											>
												{intl.formatMessage({
													id: mapHinhThucGiangDayI18n[sukien.hinhThucGiangDay as EHinhThucGiangDay],
												})}
											</Tag>
										)}
								</div>
								{location ? (
									<div className='su_kien__location'>
										<EnvironmentOutlined />
										<span>{location}</span>
									</div>
								) : null}
							</div>
							{eventTypeLabel ? (
								<Space size={4} align='center'>
									<Tag color={ColorSuKien[sukien.loaiSuKien as ELoaiSuKien]}>{eventTypeLabel}</Tag>
								</Space>
							) : null}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			<Card
				loading={loading}
				title={
					<Flex align='center' gap={12}>
						<span className='title'>Calendar</span>
						<span className='date'>{dayjs().format('DD/MM/YYYY')}</span>
					</Flex>
				}
				extra={
					<Link to='/my-calendar'>
						<Space size={4}>
							<span style={{ fontSize: 14, fontWeight: 700 }}>See More</span> <RightOutlined />
						</Space>
					</Link>
				}
				styles={{
					body: {
						padding: 0,
						position: 'relative',
					},
				}}
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
