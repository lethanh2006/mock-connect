import ButtonExtend from '@/components/Table/ButtonExtend';
import { messagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { ArrowRightOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row, Spin } from 'antd';
import moment, { type Moment } from 'moment';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { Link, useModel } from 'umi';
import FilterColumn from './components/FilterColumn';
import FormLichCaNhan from './components/FormLichCaNhan';
import GhiChuLich from './components/GhiChuLich';
import ModalViewDetailCalendar from './components/ModalViewDetail';
import ModalSettingMauLich from './components/SettingLich';
const localizer = momentLocalizer(moment);

const CalendarPage = (props: { isDashboard?: boolean }) => {
	const { visibleForm, setVisibleForm, setRecord, setEdit, selectSuKiens, getSuKienTrongKhoangModel, loading } =
		useModel('sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { record: recSetting, setVisibleForm: setVisibleMauLich, getSettingLich } = useModel('settinglich');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const [date, setDate] = useState(new Date());
	const [dateRange, setDateRange] = useState<Moment[]>([moment().startOf('week'), moment().endOf('week')]);
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [visibleXemThem, setVisibleXemThem] = useState<boolean>(false);
	const [eventsRecord, setEventRecord] = useState<(SuKien.IRecord & { title: string })[]>([]);
	const [dateXemThem, setDateXemThem] = useState<any>();
	const [selectEvent, setSelectEvent] = useState<any>();
	const { isDashboard } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('300px');

	useEffect(() => {
		getThongTinCuaToiModel();
		getSettingLich();
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
				start: moment(item?.thoiGianBatDau).toDate(),
				end: moment(item?.thoiGianKetThuc).toDate(),
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
				start: moment(item?.thoiGianBatDau).toDate(),
				end: moment(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	const getSuKien = async (): Promise<any[]> =>
		getSuKienTrongKhoangModel({
			fromDate: dateRange[0].toISOString(),
			toDate: dateRange[1].toISOString(),
			types: selectSuKiens,
		}).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
				start: moment(item?.thoiGianBatDau).toDate(),
				end: moment(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});

	const getBaiTap = async () => {
		return thongKeBaiTapModel(dateRange[0].toISOString(), dateRange[1].toISOString()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item?.assignment?.noiDung} - ${item?.assignment?.tenLopHocPhan}`,
				start: moment(item?.assignment?.thoiGianKetThuc).toDate(),
				end: moment(item?.assignment?.thoiGianKetThuc).toDate(),
				loaiSuKien: ELoaiSuKien.BAI_TAP,
			}));
			return temp;
		});
	};

	const getData = () => {
		const promises = [];
		if (selectSuKiens.includes(ELoaiSuKien.LICH_HOC)) promises.push(getThoiKhoaBieu());
		if (selectSuKiens.includes(ELoaiSuKien.LICH_THI)) promises.push(getLichThi());
		if (selectSuKiens.includes(ELoaiSuKien.CA_NHAN) || selectSuKiens.includes(ELoaiSuKien.CHUNG))
			promises.push(getSuKien());
		if (selectSuKiens.includes(ELoaiSuKien.BAI_TAP)) promises.push(getBaiTap());

		Promise.allSettled(promises)
			.then((values) => {
				const data = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				setDataCalendar(data.flat());
			})
			.catch((er) => console.log(er));
	};

	//#endregion

	useEffect(() => {
		getData();
	}, [dateRange[0].valueOf(), dateRange[1].valueOf(), selectSuKiens.length]);

	const eventPropGetter = (event: { title: string; loaiSuKien?: string }) => ({
		style: {
			backgroundColor:
				recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === event?.loaiSuKien)?.maMau ??
				ColorSuKien?.[event?.loaiSuKien as ELoaiSuKien],
		},
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event; // loaiSuKien
		return <div style={{ width: '100%', fontSize: 13 }}>{title || '--'}</div>;
	};

	const onChangeFilterDate = (val: Date) => {
		if (calendarView === Views.DAY) setDateRange([moment(val).startOf('day'), moment(val).endOf('day')]);
		else if (calendarView === Views.WEEK) setDateRange([moment(val).startOf('week'), moment(val).endOf('week')]);
		else setDateRange([moment(val).startOf('month'), moment(val).endOf('month')]);

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

	const mainContent = () => (
		<Spin spinning={loading || loadingTKB || loadingThi}>
			<Calendar
				formats={{
					dayHeaderFormat: 'dddd DD/MM/YYYY',
					dayRangeHeaderFormat: (range: DateRange) => {
						return `${moment(range.start).format('DD/MM')} - ${moment(range.end).format('DD/MM')}`;
					},
				}}
				localizer={localizer}
				events={dataCalendar}
				defaultView={Views.WEEK}
				onView={(view) => setCalendarView(view)}
				onRangeChange={(val) => {
					if (Array.isArray(val)) setDateRange([moment(val[0]).startOf('d'), moment(val.at(-1)).endOf('d')]);
					else setDateRange([moment(val.start).startOf('d'), moment(val.end).endOf('d')]);
				}}
				onNavigate={(newDate) => setDate(newDate)}
				selectable={!isDashboard}
				scrollToTime={new Date(1970, 1, 1, 6)}
				defaultDate={new Date()}
				date={date}
				messages={messagesCalendar}
				views={['month', 'week', 'day']}
				style={{ height: isDashboard ? 500 : 700, overflow: 'auto' }}
				min={moment('0000', 'HHmm').toDate()}
				max={moment('2359', 'HHmm').toDate()}
				eventPropGetter={eventPropGetter}
				onSelectSlot={handleSelect}
				onSelectEvent={(rec: any) => {
					setSelectEvent(rec);
					setVisibleDetail(true);
				}}
				components={{ event: (event: any) => eventCustom(event) }}
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
			title='Lịch'
			bordered
			extra={
				isDashboard ? (
					<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
						Xem thêm <ArrowRightOutlined />
					</Link>
				) : (
					<ButtonExtend
						tooltip='Cấu hình màu lịch'
						icon={<SettingOutlined />}
						onClick={() => setVisibleMauLich(true)}
					/>
				)
			}
		>
			{isDashboard ? (
				<Row gutter={[12, 12]}>
					<Col span={24}>{mainContent()}</Col>
					<Col span={24}>
						<GhiChuLich />
					</Col>
				</Row>
			) : (
				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					<Pane initialSize={paneSize} minSize='250px' maxSize='40%'>
						<Button
							type='primary'
							block
							onClick={() => {
								setRecord(undefined);
								setVisibleForm(true);
							}}
						>
							<PlusOutlined /> Thêm sự kiện
						</Button>

						{/* Bộ lọc */}
						<FilterColumn date={date} setDate={onChangeFilterDate} />
					</Pane>

					<Pane>{mainContent()}</Pane>
				</SplitPane>
			)}

			<Modal
				visible={visibleForm}
				bodyStyle={{ padding: 0 }}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
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
				visible={visibleXemThem}
				title={'Lịch ' + moment(dateXemThem).format('dddd, ngà\\y DD/MM/YYYY')}
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
