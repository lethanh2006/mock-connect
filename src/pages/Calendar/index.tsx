import ButtonExtend from '@/components/Table/ButtonExtend';
import { messagesCalendar } from '@/services/Calendar/constant';
import { colorHinhThucGiangDay, EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import dayjs from '@/utils/dayjs';
import {
	ArrowRightOutlined,
	CalendarOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Col, Empty, Modal, Row, Segmented, Space, Spin, Tag } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Link, useModel } from 'umi';
import FilterColumn from './components/FilterColumn';
import FormLichCaNhan from './components/FormLichCaNhan';
import GhiChuLich from './components/GhiChuLich';
import LichSapToi from './components/LichSapToi';
import ModalViewDetailCalendar from './components/ModalViewDetail';
import ModalSettingMauLich from './components/SettingLich';
import styles from './LichDashboard/styles.less';
const localizer = dayjsLocalizer(dayjs);

const CalendarPage = (props: { isDashboard?: boolean }) => {
	const {
		visibleForm,
		setVisibleForm,
		setRecord,
		setEdit,
		selectSuKiens,
		getSuKienTrongKhoangModel,
		loading,
		dataCalendar,
		setDataCalendar,
		dataCalendarDashboard,
		setDataLich,
		edit,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { record: recSetting, setVisibleForm: setVisibleMauLich, getSettingLich } = useModel('tienich.settinglich');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
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
	const [paneSize, setPaneSize] = useState('300px');
	const [segmentSelected, setSegmentSelected] = useState(true);

	useEffect(() => {
		if (!recSetting?._id) getSettingLich();
	}, []);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	//#region Get Data
	const getThoiKhoaBieu = async (): Promise<any[]> =>
		getTrongKhoangModel({
			fromDate: dateRange[0].toISOString(),
			toDate: dateRange[1].toISOString(),
		}).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''} - ${
					item.phongHoc ?? ''
				}`,
				loaiSuKien: ELoaiSuKien.LICH_HOC,
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	const getLichThi = async (): Promise<any[]> =>
		getLichThiModel({
			fromDate: dateRange[0].toISOString(),
			toDate: dateRange[1].toISOString(),
		}).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item.danhSachHocPhan?.map((i) => i.ten)?.join(', ') || ''} - ${item.phong?.ma ?? ''}`,
				loaiSuKien: ELoaiSuKien.LICH_THI,
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	const getSuKien = async (): Promise<any[]> =>
		getSuKienTrongKhoangModel({
			fromDate: dateRange[0].toISOString(),
			toDate: dateRange[1].toISOString(),
			// types: selectSuKiens, // Fix Tạm Thời
		}).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	const getBaiTap = async () => {
		return thongKeBaiTapModel(dateRange[0].toISOString(), dateRange[1].toISOString()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item?.assignment?.noiDung} - ${item?.assignment?.tenLopHocPhan}`,
				start: dayjs(item?.assignment?.thoiGianGiao ?? item.assignment.thoiGianBatDau).toDate(),
				end: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
				loaiSuKien: ELoaiSuKien.BAI_TAP,
			}));
			return temp;
		});
	};

	const getData = () => {
		const promises = [getThoiKhoaBieu(), getSuKien(), getLichThi(), getBaiTap()];

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
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title || '--'}</div>;
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

	const renderContent = () => {
		// Convert dữ liệu
		const data = dataCalendarDashboard
			?.filter((event) => dayjs(event.thoiGianBatDau).isSameOrAfter(dayjs(), 'd'))
			?.reduce<any>((result, item) => {
				if (!item?.thoiGianBatDau) {
					return result;
				}
				const ngayDayjs = dayjs(item?.thoiGianBatDau);
				const ngayString = ngayDayjs.format('YYYY-MM-DD');

				return {
					...result,
					[ngayString]: {
						thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayDayjs.toDate().getDay()],
						cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
							...item,
							tenSuKien: item.title,
							suffix: item.suffix ?? item.diaDiem,
						}),
					},
				};
			}, {});

		const keysSorted = sortBy(Object.keys(data));
		if (!loading && !loading && isEmpty(data)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có sự kiện' />;
		}

		return (
			<div className={styles.dashboard_calendar}>
				{keysSorted.map((ngay) => {
					const { cacSuKien, thuTrongTuan } = data[ngay];
					const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau));
					return (
						<div key={ngay} className={styles.ngay}>
							<Space style={{ marginBottom: 8 }}>
								<Badge count={cacSuKien.length} size='small' offset={[15, 11]} color='#D66'>
									<div
										className={styles.ngay__title}
										style={{ color: dayjs().isSame(ngay, 'day') ? 'var(--color-primary)' : undefined }}
									>
										{thuTrongTuan}, ngày {dayjs(ngay).format('DD/MM')}
									</div>
								</Badge>
							</Space>
							{cacSuKienSorted.map((sukien) => (
								<div
									key={sukien._id}
									className={styles.su_kien}
									// style={{ background: ColorSuKien[sukien.loaiSuKien] }}
									onClick={() => {
										setSelectEvent(sukien);
										setVisibleDetail(true);
									}}
								>
									<div className={styles.su_kien__left}>
										{dayjs().isSameOrAfter(sukien.thoiGianBatDau) && dayjs().isSameOrBefore(sukien.thoiGianKetThuc) ? (
											<div className={styles.pulse} />
										) : null}
										<div className={styles.su_kien__thoi_gian}>{dayjs(sukien.thoiGianBatDau).format('HH:mm')}</div>
									</div>
									<Space
										wrap
										className={styles.su_kien__right}
										style={{
											borderColor:
												recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ??
												ColorSuKien[sukien.loaiSuKien as ELoaiSuKien],
										}}
									>
										<div>
											{sukien.tenSuKien ?? ''}
											{sukien.suffix ? <i> ({sukien.suffix})</i> : null}
										</div>
										{sukien.loaiSuKien === ELoaiSuKien.LICH_HOC &&
											sukien.hinhThucGiangDay === EHinhThucGiangDay.ONLINE && (
												<Tag color={colorHinhThucGiangDay[sukien.hinhThucGiangDay as EHinhThucGiangDay]}>
													{sukien.hinhThucGiangDay}
												</Tag>
											)}
									</Space>
								</div>
							))}
						</div>
					);
				})}
			</div>
		);
	};

	const mainContent = () => (
		<Spin spinning={loading || loadingTKB || loadingThi}>
			<Calendar
				formats={{
					dayHeaderFormat: 'dddd DD/MM/YYYY',
					dayRangeHeaderFormat: (range: DateRange) => {
						return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
					},
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
				views={['month', 'week', 'day', 'agenda']}
				style={{ height: isDashboard ? 500 : 700, overflow: 'auto' }}
				eventPropGetter={eventPropGetter}
				onSelectSlot={handleSelect}
				onSelectEvent={(rec: any) => {
					setSelectEvent(rec);
					setVisibleDetail(true);
				}}
				components={{
					event: (event: any) => eventCustom(event),
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
			className='card-borderless card-big-title'
			title={
				<>
					Lịch{' '}
					<Segmented
						value={segmentSelected}
						options={[
							{ icon: <CalendarOutlined />, value: true, title: 'Dạng lịch tuần' },
							{ icon: <MenuOutlined />, value: false, title: 'Dạng danh sách' },
						]}
						size='small'
						onChange={(val) => {
							setSegmentSelected(val);
						}}
					/>
				</>
			}
			extra={
				isDashboard ? (
					<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
						Xem thêm <ArrowRightOutlined />
					</Link>
				) : (
					<Space wrap>
						<Button
							type='primary'
							onClick={() => {
								setRecord(undefined);
								setVisibleForm(true);
							}}
							icon={<PlusCircleOutlined />}
						>
							Thêm sự kiện cá nhân
						</Button>
						<ButtonExtend
							tooltip='Cấu hình màu lịch'
							icon={<SettingOutlined />}
							onClick={() => setVisibleMauLich(true)}
						/>
					</Space>
				)
			}
		>
			{isDashboard ? (
				<Row gutter={[12, 12]}>
					<Col span={24}>{mainContent()}</Col>
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
						{/* Bộ lọc */}
						<FilterColumn date={date} setDate={onChangeFilterDate} />

						{/* Card Lịch sắp tới */}
						<div style={{ marginTop: 12 }}>
							<LichSapToi
								dataCalendar={dataCalendar}
								onEventClick={(event) => {
									setSelectEvent(event);
									setVisibleDetail(true);
								}}
							/>
						</div>
					</Pane>

					{isMobile && (
						<Pane>
							<Card variant='borderless'>{segmentSelected ? mainContent() : renderContent()}</Card>
						</Pane>
					)}
				</SplitPane>
			)}

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
				width={800}
				title={edit ? 'Chỉnh sửa sự kiện' : 'Thêm mới sự kiện'}
			>
				<FormLichCaNhan getData={getData} />
			</Modal>

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
				title={'Lịch ' + dayjs(dateXemThem).format('dddd, ngà\y DD/MM/YYYY')}
				onCancel={() => setVisibleXemThem(false)}
				footer={null}
			>
				{eventsRecord?.map((item) => {
					return (
						<div
							key={item._id}
							style={{
								backgroundColor: ColorSuKien?.[item?.loaiSuKien],
								color: 'white',
								padding: 5,
								marginBottom: 10,
								borderRadius: 2,
								cursor: 'pointer',
							}}
							onClick={() => {
								setSelectEvent(item);
								setVisibleDetail(true);
							}}
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
