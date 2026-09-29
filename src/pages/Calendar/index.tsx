import EmptyState from '@/components/EmptyState';
import { IconArrowRight, IconCalendar, IconGear, IconHumberger } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import Segmented from '@/components/MySegmented';
import PageCard, { Card } from '@/components/PageCard';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { EVENT_TYPE_TAG, useLoaiSuKienLabel, useMessagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Spin } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import type { View } from 'react-big-calendar';
import { Views } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Link, useIntl, useModel } from 'umi';
import CalendarBoard, {
	CalendarToolbar,
	getCalendarDateRange,
	getEventLocation,
	shiftCalendarDate,
} from './components/CalendarBoard';
import FilterColumn from './components/FilterColumn';
import GhiChuLich from './components/GhiChuLich';
// import LichSapToi from './components/LichSapToi';
import ModalViewDetailCalendar from './components/ModalViewDetail';
import ModalSettingMauLich from './components/SettingLich';
import './style.less';

const getListEventTag = (loaiSuKien?: string) =>
	EVENT_TYPE_TAG[loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac] ?? 'rgba(19, 77, 139, 0.12)';

const CalendarPage = (props: { isDashboard?: boolean }) => {
	const intl = useIntl();
	const messagesCalendar = useMessagesCalendar();
	const getLoaiSuKienLabel = useLoaiSuKienLabel();
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
	const [segmentSelected, setSegmentSelected] = useState(true);

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const setCalendarDateByView = (nextDate: Date, view: View = calendarView) => {
		setDateRange(getCalendarDateRange(nextDate, view));
		setDate(nextDate);
	};

	const onNavigateList = (action: 'today' | 'previous' | 'next') => {
		setCalendarDateByView(shiftCalendarDate(date, calendarView, action));
	};

	const onChangeListView = (view: View) => {
		setCalendarView(view);
		setCalendarDateByView(date, view);
	};

	const getWeekdayLabel = (value: string | Date) =>
		new Intl.DateTimeFormat(intl.locale?.startsWith('en') ? 'en-US' : 'vi-VN', { weekday: 'short' }).format(
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
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				location: `${item.phongHoc ?? ''}`,
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
		<CalendarToolbar
			date={date}
			view={calendarView}
			dateRange={[dateRange[0], dateRange[1]]}
			onNavigate={onNavigateList}
			onChangeView={onChangeListView}
		/>
	);

	const renderListEventTimes = (event: any) => {
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
			<div className='calendar-list'>
				{renderListToolbar()}
				{!loading && isEmpty(data) ? <EmptyState description={intl.formatMessage({ id: 'lichsukien.empty' })} /> : null}
				<div className='calendar-list__days'>
					{keysSorted.map((ngay) => {
						const { cacSuKien, thuTrongTuan } = data[ngay];
						const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau ?? suKien.start));
						const isToday = dayjs().isSame(ngay, 'day');
						const dayLabel = `${thuTrongTuan}, ${formatDate(ngay, 'DD/MM/YYYY')}`;

						return (
							<section key={ngay} className='calendar-day-card'>
								<header className='calendar-day-card__title'>
									<div className='calendar-day-card__label'>{dayLabel}</div>
									{isToday ? <span className='calendar-day-card__count'>{messagesCalendar.today}</span> : null}
								</header>
								<div className='calendar-day-card__content'>
									{cacSuKienSorted.map((sukien, index) => {
										const location = getEventLocation(sukien) ?? sukien.suffix;
										const { start, end } = renderListEventTimes(sukien);
										const lineColor =
											recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ??
											ColorSuKien?.[sukien.loaiSuKien as ELoaiSuKien | ELoaiSuKienKhac] ??
											'#134D8B';
										const eventTypeLabel = sukien.loaiSuKien ? getLoaiSuKienLabel(sukien.loaiSuKien) : '';

										return (
											<div
												key={`${sukien._id ?? sukien.title}-${sukien.ngayHienThi ?? sukien.thoiGianBatDau}`}
												className='calendar-list-event'
												onClick={() => handleEventClick(sukien)}
											>
												<div className='calendar-list-event__time'>
													<span className='calendar-list-event__start'>{start}</span>
													{end ? <span className='calendar-list-event__end'>{end}</span> : null}
												</div>
												<span className='calendar-list-event__line' style={{ background: lineColor }} aria-hidden />
												<div className='calendar-list-event__body'>
													<div className='calendar-list-event__title'>{sukien.tenSuKien ?? ''}</div>
													{location ? <div className='calendar-list-event__location'>{location}</div> : null}
												</div>
												{eventTypeLabel ? (
													<span
														className='calendar-list-event__tag'
														style={{ background: getListEventTag(sukien.loaiSuKien) }}
													>
														{eventTypeLabel}
													</span>
												) : null}
												{index < cacSuKienSorted.length - 1 ? <div className='calendar-list-event__divider' /> : null}
											</div>
										);
									})}
								</div>
							</section>
						);
					})}
				</div>
			</div>
		);
	};

	const mainContent = () => (
		<Spin spinning={loading || loadingTKB}>
			<CalendarBoard
				events={dataCalendar}
				date={date}
				view={calendarView}
				dateRange={[dateRange[0], dateRange[1]]}
				onNavigate={onNavigateList}
				onChangeView={onChangeListView}
				onCalendarNavigate={(newDate) => setDate(newDate)}
				onRangeChange={(val) => {
					if (Array.isArray(val)) setDateRange([dayjs(val[0]).startOf('d'), dayjs(val.at(-1)).endOf('d')]);
					else setDateRange([dayjs(val.start).startOf('d'), dayjs(val.end).endOf('d')]);
				}}
				selectable={!isDashboard}
				height={isDashboard ? 500 : 'calc(100vh - 240px)'}
				calendarMinHeight={isDashboard ? undefined : 640}
				onSelectSlot={handleSelect}
				onSelectEvent={handleEventClick}
				popup
				onShowMore={(events, selectedDate) => {
					setEventRecord(events);
					setDateXemThem(selectedDate);
					setVisibleXemThem(true);
				}}
			/>
		</Spin>
	);

	return (
		<PageCard
			stickyHeader
			hideInnerCard
			title={
				<div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
					<span>{intl.formatMessage({ id: 'lichsukien.title' })}</span>
					<Segmented
						value={segmentSelected}
						options={[
							{ icon: <IconCalendar />, value: true, title: intl.formatMessage({ id: 'lichsukien.danglich' }) },
							{ icon: <IconHumberger />, value: false, title: intl.formatMessage({ id: 'lichsukien.danhsach' }) },
						]}
						size='small'
						onChange={(val) => {
							setSegmentSelected(val);
						}}
					/>
				</div>
			}
		>
			{isDashboard ? (
				<Row gutter={[12, 12]}>
					<Col span={24}>
						{mainContent()}
						<div style={{ marginTop: 8, textAlign: 'right' }}>
							<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
								{intl.formatMessage({ id: 'lichsukien.xemthem' })} <IconArrowRight />
							</Link>
						</div>
					</Col>
					<Col span={24}>
						<GhiChuLich isDashboard />
					</Col>
				</Row>
			) : (
				<div className='calendar-layout'>
					<Card
						className='calendar-board'
						variant='borderless'
						styles={{ body: { padding: '8px 24px 24px', height: '100%' } }}
					>
						{segmentSelected ? mainContent() : renderContent()}
					</Card>
					<Card
						className='calendar-setting'
						headerType='custom'
						title={intl.formatMessage({ id: 'lichsukien.caidat' })}
						styles={{ body: { padding: 0 } }}
						extra={
							<button
								type='button'
								className='calendar-setting__gear'
								aria-label={intl.formatMessage({ id: 'lichsukien.cauhinh' })}
								onClick={() => setVisibleMauLich(true)}
							>
								<IconGear size={24} />
							</button>
						}
					>
						<FilterColumn date={date} setDate={onChangeFilterDate} />
					</Card>
				</div>
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

			<ModalExpandable
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
			</ModalExpandable>

			<ModalSettingMauLich />
		</PageCard>
	);
};

export default CalendarPage;
