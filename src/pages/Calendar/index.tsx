import ButtonExtend from '@/components/Table/ButtonExtend';
import { useMessagesCalendar } from '@/services/Calendar/constant';
import { colorHinhThucGiangDay, EHinhThucGiangDay, mapHinhThucGiangDayI18n } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import {
	ArrowRightOutlined,
	CalendarOutlined,
	EnvironmentOutlined,
	MenuOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Card, Col, Divider, Empty, Flex, Modal, Row, Segmented, Space, Spin, Tag } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Link, useIntl, useModel } from 'umi';
import FilterColumn from './components/FilterColumn';
import GhiChuLich from './components/GhiChuLich';
// import LichSapToi from './components/LichSapToi';
import ModalViewDetailCalendar from './components/ModalViewDetail';
import ModalSettingMauLich from './components/SettingLich';
import styles from './LichDashboard/styles.less';

const localizer = dayjsLocalizer(dayjs);

const getEventLocation = (event: {
	loaiSuKien?: string;
	phongHoc?: string;
	phong?: { ma?: string };
	diaDiem?: string;
	assignment?: { tenLopHocPhan?: string };
	location?: string;
}) =>
	event.location ??
	(event.loaiSuKien === ELoaiSuKien.LICH_HOC
		? event.phongHoc
		: (event.phong?.ma ?? event.assignment?.tenLopHocPhan ?? event.diaDiem));

const CalendarPage = (props: { isDashboard?: boolean }) => {
	const intl = useIntl();
	const messagesCalendar = useMessagesCalendar();
	const { visibleForm, setVisibleForm, setRecord, setEdit, loading, dataCalendar, setDataCalendar, setDataLich, edit } =
		useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	// const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { record: recSetting, setVisibleForm: setVisibleMauLich, getSettingLich } = useModel('tienich.settinglich');
	// const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { getLichDangKyTinChiTrongKhoangModel } = useModel('daotao.dotdangkytinchi');
	const [date, setDate] = useState(new Date());
	const [dateRange, setDateRange] = useState([dayjs().startOf('week'), dayjs().endOf('week')]);
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [visibleXemThem, setVisibleXemThem] = useState<boolean>(false);
	const [eventsRecord, setEventRecord] = useState<(SuKien.IRecord & { title: string })[]>([]);
	const [dateXemThem, setDateXemThem] = useState<any>();
	const [selectEvent, setSelectEvent] = useState<any>();
	const { isDashboard } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [, setPaneSize] = useState('300px');
	const [segmentSelected, setSegmentSelected] = useState(true);

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const setCalendarDateByView = (nextDate: Date, view: View = calendarView) => {
		if (view === Views.DAY) setDateRange([dayjs(nextDate).startOf('day'), dayjs(nextDate).endOf('day')]);
		else if (view === Views.WEEK) setDateRange([dayjs(nextDate).startOf('week'), dayjs(nextDate).endOf('week')]);
		else setDateRange([dayjs(nextDate).startOf('month'), dayjs(nextDate).endOf('month')]);

		setDate(nextDate);
	};

	const renderToolbarLabel = () => {
		if (calendarView === Views.DAY) return formatDate(date, 'DD/MM');
		if (calendarView === Views.MONTH) return formatDate(date, 'MM/YYYY');

		return `${formatDate(dateRange[0], 'DD/MM')} - ${formatDate(dateRange[1], 'DD/MM')}`;
	};

	const onNavigateList = (action: 'today' | 'previous' | 'next') => {
		if (action === 'today') {
			setCalendarDateByView(new Date());
			return;
		}

		const unit = calendarView === Views.MONTH ? 'month' : calendarView === Views.DAY ? 'day' : 'week';
		const nextDate =
			action === 'next'
				? dayjs(date)
						.add(1, unit as dayjs.ManipulateType)
						.toDate()
				: dayjs(date)
						.subtract(1, unit as dayjs.ManipulateType)
						.toDate();

		setCalendarDateByView(nextDate);
	};

	const onChangeListView = (view: View) => {
		setCalendarView(view);
		setCalendarDateByView(date, view);
	};

	const getWeekdayLabel = (value: string | Date) =>
		new Intl.DateTimeFormat(intl.locale?.startsWith('en') ? 'en-US' : 'vi-VN', { weekday: 'long' }).format(
			dayjs(value).toDate(),
		);

	//#region Get Data
	const getThoiKhoaBieu = async (): Promise<any[]> =>
		getTrongKhoangModel({
			fromDate: dateRange[0].toISOString(),
			toDate: dateRange[1].toISOString(),
		}).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || '',
				location: item.phongHoc,
				loaiSuKien: ELoaiSuKien.LICH_HOC,
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	// const getLichThi = async (): Promise<any[]> =>
	// 	getLichThiModel({
	// 		fromDate: dateRange[0].toISOString(),
	// 		toDate: dateRange[1].toISOString(),
	// 	}).then((data) => {
	// 		const temp = data.map((item) => ({
	// 			...item,
	// 			title: item.danhSachHocPhan?.map((i) => i.ten)?.join(', ') || '',
	// 			location: item.phong?.ma,
	// 			loaiSuKien: ELoaiSuKien.CHUNG,
	// 			start: dayjs(item?.thoiGianBatDau).toDate(),
	// 			end: dayjs(item?.thoiGianKetThuc).toDate(),
	// 		}));
	// 		return temp;
	// 	});

	// const getSuKien = async (): Promise<any[]> =>
	// 	getSuKienTrongKhoangModel({
	// 		fromDate: dateRange[0].toISOString(),
	// 		toDate: dateRange[1].toISOString(),
	// 		// types: selectSuKiens,
	// 	}).then((data) => {
	// 		const temp = data.map((item) => ({
	// 			...item,
	// 			title: item?.tenSuKien ?? '',
	// 			location: item?.diaDiem,
	// 			start: dayjs(item?.thoiGianBatDau).toDate(),
	// 			end: dayjs(item?.thoiGianKetThuc).toDate(),
	// 		}));
	// 		return temp;
	// 	});

	// const getBaiTap = async () => {
	// 	return thongKeBaiTapModel(dateRange[0].toISOString(), dateRange[1].toISOString()).then((data) => {
	// 		const temp = data.map((item) => ({
	// 			...item,
	// 			title: item?.assignment?.noiDung ?? '',
	// 			location: item?.assignment?.tenLopHocPhan,
	// 			start: dayjs(item?.assignment?.thoiGianGiao ?? item.assignment.thoiGianBatDau).toDate(),
	// 			end: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
	// 			loaiSuKien: ELoaiSuKien.CHUNG,
	// 		}));
	// 		return temp;
	// 	});
	// };

	const getLichDKtc = async (): Promise<any[]> =>
		getLichDangKyTinChiTrongKhoangModel({
			fromDate: dateRange[0].subtract(1, 'year').toISOString(),
			toDate: dateRange[1].add(1, 'year').toISOString(),
		}).then((data) =>
			data.map((item) => ({
				...item,
				title: intl.formatMessage({ id: 'lichsukien.dangky_tinchi.title' }, { ten: item?.ten ?? '' }),
				tenSuKien: intl.formatMessage({ id: 'lichsukien.dangky_tinchi.title' }, { ten: item?.ten ?? '' }),
				loaiSuKien: ELoaiSuKien.CHUNG,
				isLichDktc: true,
				allDay: true,
				start: dayjs(item?.thoiGianBatDau).startOf('day').toDate(),
				end: dayjs(item?.thoiGianKetThuc).add(1, 'day').startOf('day').toDate(),
			})),
		);

	const getData = () => {
		const promises = [getThoiKhoaBieu(), getLichDKtc()];

		Promise.allSettled(promises)
			.then((values) => {
				const data = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				setDataCalendar(data.flat());
				setDataLich(data.flat());
			})
			.catch((er) => console.log(er));
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [dateRange[0].valueOf(), dateRange[1].valueOf()]);

	const eventPropGetter = (event: { title: string; loaiSuKien?: string }) => ({
		style: {
			backgroundColor:
				recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === event?.loaiSuKien)?.maMau ??
				ColorSuKien?.[event?.loaiSuKien as ELoaiSuKien],
		},
	});

	const eventCustom = ({ event }: any) => {
		const location = getEventLocation(event);
		return (
			<div>
				<div>{event.title || '--'}</div>
				{location ? (
					<Flex align='center' gap={6}>
						<EnvironmentOutlined />
						<span>{location}</span>
					</Flex>
				) : null}
			</div>
		);
	};

	const onChangeFilterDate = (val: Date) => {
		if (calendarView === Views.DAY) setDateRange([dayjs(val).startOf('day'), dayjs(val).endOf('day')]);
		else if (calendarView === Views.WEEK) setDateRange([dayjs(val).startOf('week'), dayjs(val).endOf('week')]);
		else setDateRange([dayjs(val).startOf('month'), dayjs(val).endOf('month')]);

		setDate(val);
	};

	const handleSelect = (event?: any) => {
		if (isDashboard) return;
		setRecord({
			thoiGianBatDau: event?.start?.toISOString(),
			thoiGianKetThuc: event?.end?.toISOString(),
		} as SuKien.IRecord);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEventClick = (rec: any) => {
		setSelectEvent(rec);
		setVisibleDetail(true);
	};

	const renderListToolbar = () => (
		<div className='rbc-toolbar'>
			<span className='rbc-btn-group'>
				<button type='button' onClick={() => onNavigateList('today')}>
					{messagesCalendar.today}
				</button>
				<button type='button' onClick={() => onNavigateList('previous')}>
					{messagesCalendar.previous}
				</button>
				<button type='button' onClick={() => onNavigateList('next')}>
					{messagesCalendar.next}
				</button>
			</span>
			<span className='rbc-toolbar-label'>{renderToolbarLabel()}</span>
			<span className='rbc-btn-group'>
				<button
					type='button'
					className={calendarView === Views.MONTH ? 'rbc-active' : undefined}
					onClick={() => onChangeListView(Views.MONTH)}
				>
					{messagesCalendar.month}
				</button>
				<button
					type='button'
					className={calendarView === Views.WEEK ? 'rbc-active' : undefined}
					onClick={() => onChangeListView(Views.WEEK)}
				>
					{messagesCalendar.week}
				</button>
				<button
					type='button'
					className={calendarView === Views.DAY ? 'rbc-active' : undefined}
					onClick={() => onChangeListView(Views.DAY)}
				>
					{messagesCalendar.day}
				</button>
			</span>
		</div>
	);

	const renderListEventTime = (event: any) => {
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
		// Convert dữ liệu
		const data = dataCalendar
			?.filter((event: any) => {
				const thoiGianBatDau = event.thoiGianBatDau ?? event.start;
				const thoiGianKetThuc = event.thoiGianKetThuc ?? event.end ?? event.thoiGianBatDau;
				return (
					thoiGianBatDau &&
					thoiGianKetThuc &&
					dayjs(thoiGianBatDau).isSameOrBefore(dateRange[1], 'day') &&
					dayjs(thoiGianKetThuc).isSameOrAfter(dateRange[0], 'day')
				);
			})
			?.reduce<any>((result, item: any) => {
				if (!item?.thoiGianBatDau) {
					return result;
				}

				const ngayBatDau = dayjs(item.thoiGianBatDau ?? item.start);
				const ngayKetThuc = dayjs(item.thoiGianKetThuc ?? item.end ?? item.thoiGianBatDau);
				const ngayDauTrongKhoang = ngayBatDau.isBefore(dateRange[0], 'day') ? dateRange[0] : ngayBatDau;
				const ngayCuoiTrongKhoang = ngayKetThuc.isAfter(dateRange[1], 'day') ? dateRange[1] : ngayKetThuc;
				const nextResult = { ...result };

				let ngayDayjs = ngayDauTrongKhoang.startOf('day');
				while (ngayDayjs.isSameOrBefore(ngayCuoiTrongKhoang, 'day')) {
					const ngayString = ngayDayjs.format('YYYY-MM-DD');
					nextResult[ngayString] = {
						thuTrongTuan: nextResult[ngayString]?.thuTrongTuan ?? getWeekdayLabel(ngayDayjs.toDate()),
						cacSuKien: (nextResult[ngayString]?.cacSuKien ?? []).concat({
							...item,
							ngayHienThi: ngayDayjs.toISOString(),
							tenSuKien: item.title,
							suffix: item.location ?? item.suffix ?? item.diaDiem,
						}),
					};
					ngayDayjs = ngayDayjs.add(1, 'day');
				}

				return nextResult;
			}, {});

		const keysSorted = sortBy(Object.keys(data));

		return (
			<div className={styles.dashboard_calendar}>
				{renderListToolbar()}
				{!loading && isEmpty(data) ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.formatMessage({ id: 'lichsukien.empty' })} />
				) : null}
				{keysSorted.map((ngay) => {
					const { cacSuKien, thuTrongTuan } = data[ngay];
					const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau));
					return (
						<div key={ngay} className={styles.ngay}>
							<Divider orientation='left' className='divider-big-title'>
								<Space size={8}>
									<div
										className={styles.ngay__title}
										style={{ color: dayjs().isSame(ngay, 'day') ? 'var(--color-primary)' : undefined }}
									>
										{dayjs().isSame(ngay, 'day')
											? messagesCalendar.today
											: `${thuTrongTuan}, ${formatDate(ngay, 'DD/MM')}`}
									</div>
									<Tag color='yellow'>{cacSuKien.length}</Tag>
								</Space>
							</Divider>
							{cacSuKienSorted.map((sukien) => {
								const location = getEventLocation(sukien) ?? sukien.suffix;

								return (
									<div
										key={`${sukien._id ?? sukien.title}-${sukien.ngayHienThi ?? sukien.thoiGianBatDau}`}
										className={`${styles.su_kien} ${dayjs().isSame(ngay, 'day') ? styles.today : ''}`}
										// style={{ background: ColorSuKien[sukien.loaiSuKien] }}
										onClick={() => handleEventClick(sukien)}
									>
										<div className={styles.su_kien__left}>
											<div
												className={styles.su_kien__thoi_gian}
												style={{ color: dayjs().isSame(ngay, 'day') ? '#0E50CF' : undefined }}
											>
												{renderListEventTime(sukien)}
											</div>
										</div>
										<div
											className={styles.su_kien__right}
											style={{
												borderColor:
													recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)
														?.maMau ?? ColorSuKien[sukien.loaiSuKien as ELoaiSuKien],
											}}
										>
											<div className={styles.su_kien__title}>
												{sukien.tenSuKien ?? ''}
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
												<div className={styles.su_kien__location}>
													<EnvironmentOutlined />
													<span>{location}</span>
												</div>
											) : null}
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	};

	const mainContent = () => (
		<Spin spinning={loading || loadingTKB}>
			<Calendar
				formats={{
					dayHeaderFormat: 'dddd DD/MM/YYYY',
					dayRangeHeaderFormat: (range: DateRange) => {
						return `${formatDate(range.start, 'DD/MM')} - ${formatDate(range.end, 'DD/MM')}`;
					},
					eventTimeRangeFormat: () => '',
				}}
				slotPropGetter={(date) => {
					return { style: { borderTop: 'none' } };
				}}
				localizer={localizer}
				events={dataCalendar}
				defaultView={Views.WEEK}
				onView={(view) => setCalendarView(view)}
				onRangeChange={(val) => {
					if (Array.isArray(val)) setDateRange([dayjs(val[0]).startOf('d'), dayjs(val.at(-1)).endOf('d')]);
					else setDateRange([dayjs(val.start).startOf('d'), dayjs(val.end).endOf('d')]);
				}}
				onNavigate={(newDate) => setDate(newDate)}
				selectable={!isDashboard}
				scrollToTime={new Date(1970, 1, 1, 6)}
				defaultDate={new Date()}
				date={date}
				messages={messagesCalendar}
				views={['month', 'week', 'day']}
				style={{ height: isDashboard ? 500 : 700, overflow: 'auto' }}
				eventPropGetter={eventPropGetter}
				onSelectSlot={handleSelect}
				onSelectEvent={handleEventClick}
				components={{
					event: (event: any) => eventCustom(event),
					timeGutterHeader: () => <span>{messagesCalendar.allDay}</span>,
				}}
				popup
				onShowMore={(events: any[], d) => {
					setEventRecord(events);
					setDateXemThem(d);
					setVisibleXemThem(true);
				}}
			/>
		</Spin>
	);

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title has-indicator'
			title={
				<>
					{intl.formatMessage({ id: 'lichsukien.title' })}{' '}
					<Segmented
						value={segmentSelected}
						options={[
							{ icon: <CalendarOutlined />, value: true, title: intl.formatMessage({ id: 'lichsukien.danglich' }) },
							{ icon: <MenuOutlined />, value: false, title: intl.formatMessage({ id: 'lichsukien.danhsach' }) },
						]}
						size='small'
						onChange={(val) => {
							setSegmentSelected(val);
						}}
					/>
				</>
			}
		>
			{isDashboard ? (
				<Row gutter={[12, 12]}>
					<Col span={24}>
						{mainContent()}
						<div style={{ marginTop: 8, textAlign: 'right' }}>
							<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
								{intl.formatMessage({ id: 'lichsukien.xemthem' })} <ArrowRightOutlined />
							</Link>
						</div>
					</Col>
					<Col span={24}>
						<GhiChuLich isDashboard />
					</Col>
				</Row>
			) : (
				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					{!isMobile && (
						<Pane>
							<Card variant='borderless'>{segmentSelected ? mainContent() : renderContent()}</Card>
						</Pane>
					)}

					<Pane initialSize='300px' minSize='250px' maxSize='40%'>
						<Card
							title='Calendar Settings'
							extra={
								<Space wrap>
									{/* <ButtonExtend
										type='link'
										size='large'
										tooltip={intl.formatMessage({ id: 'lichsukien.themmoi' })}
										icon={<PlusCircleOutlined />}
										onClick={() => {
											setRecord(undefined);
											setVisibleForm(true);
										}}
									/> */}
									<ButtonExtend
										type='link'
										size='large'
										tooltip={intl.formatMessage({ id: 'lichsukien.cauhinh' })}
										icon={<SettingOutlined />}
										onClick={() => setVisibleMauLich(true)}
									/>
								</Space>
							}
						>
							<FilterColumn date={date} setDate={onChangeFilterDate} />

							{/* <div style={{ marginTop: 12 }}>
								<LichSapToi
									dataCalendar={dataCalendar}
									onEventClick={(event) => {
										setSelectEvent(event);
										setVisibleDetail(true);
									}}
								/>
							</div> */}
						</Card>
					</Pane>

					{isMobile && (
						<Pane>
							<Card variant='borderless'>{segmentSelected ? mainContent() : renderContent()}</Card>
						</Pane>
					)}
				</SplitPane>
			)}

			{/* <Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
				width={800}
				title={
					edit
						? intl.formatMessage({ id: 'lichsukien.form.chinhsua' })
						: intl.formatMessage({ id: 'lichsukien.form.themmoi' })
				}
			>
				<FormLichCaNhan getData={getData} />
			</Modal> */}

			{/* Modal xem chi tiết lịch */}
			{selectEvent ? (
				<ModalViewDetailCalendar
					visible={visibleDetail}
					setVisible={setVisibleDetail}
					event={selectEvent}
					getData={getData}
				/>
			) : null}

			<Modal
				open={visibleXemThem}
				title={
					`${intl.formatMessage({ id: 'lichsukien.title' })} ` + formatDate(dateXemThem, 'dddd, [ngày] DD/MM/YYYY')
				}
				onCancel={() => setVisibleXemThem(false)}
				footer={null}
			>
				{eventsRecord?.map((item) => {
					return (
						<div
							key={item._id}
							style={{
								backgroundColor: ColorSuKien?.[item?.loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac] || '#f0f0f0',
								color: 'white',
								padding: 5,
								marginBottom: 10,
								borderRadius: 2,
								cursor: 'pointer',
							}}
							onClick={() => handleEventClick(item)}
						>
							<b>{item?.loaiSuKien}</b>: {item?.title}
						</div>
					);
				})}
			</Modal>

			<ModalSettingMauLich />
		</Card>
	);
};

export default CalendarPage;
