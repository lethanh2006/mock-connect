import { colorHinhThucGiangDay, EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { ArrowRightOutlined, CalendarOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Empty, Modal, Row, Segmented, Space, Tag, Typography } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link, useModel } from 'umi';
import FormLichCaNhan from '../components/FormLichCaNhan';
import GhiChuLich from '../components/GhiChuLich';
import ModalViewDetailCalendar from '../components/ModalViewDetail';
import styles from './styles.less';

const tmp: any = Calendar;
const DnDCalendar = withDragAndDrop(tmp);

const getThoiGianMotTuanKeTuHomNay = () => {
	return {
		fromDate: moment().startOf('day').toISOString(),
		toDate: moment().add(7, 'day').endOf('day').toISOString(),
	};
};

const LichDashboard = () => {
	const {
		visibleForm,
		setVisibleForm,
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		setDataLichDashboard,
		dataLichDashboard,
		dataCalendarDashboard,
		setDataCalendarDashboard,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();
	const localizer = momentLocalizer(moment);
	const [segmentSelected, setSegmentSelected] = useState<string>(localStorage.getItem('loaiLich') ?? 'list');

	//#region Get Data
	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || '',
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			}));
			return temp;
		});
	};

	const getLichThi = async () => {
		return getLichThiModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `Lịch thi: ${item.danhSachHocPhan?.map((i) => i.ten).join(', ')}`,
				phongHoc: item.phong?.ma ?? '',
				loaiSuKien: ELoaiSuKien.LICH_THI,
			}));
			return temp;
		});
	};

	const getSuKien = async () => {
		return getSuKienTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
			}));
			return temp;
		});
	};

	const getBaiTap = async () => {
		return thongKeBaiTapModel(
			moment().startOf('day').toISOString(),
			moment().add(2, 'months').endOf('day').toISOString(),
		).then((data) => {
			const aWeekLater = moment().add(7, 'day').endOf('day').toDate();
			const temp = data
				.map((item) => ({
					...item,
					title: `${item?.assignment?.noiDung} - ${item?.assignment?.tenLopHocPhan}`,
					thoiGianBatDau: moment(item?.assignment?.thoiGianKetThuc).toDate(),
					thoiGianKetThuc: moment(item?.assignment?.thoiGianKetThuc).toDate(),
					loaiSuKien: ELoaiSuKien.BAI_TAP,
				}))
				.filter((i) => i.thoiGianBatDau > new Date() && i.thoiGianKetThuc < aWeekLater);
			return temp;
		});
	};

	const getData = () => {
		const promises = [getThoiKhoaBieu(), getSuKien(), getLichThi(), getBaiTap()];

		Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				const data = responses.flat();
				setDataLichDashboard(data);
			})
			.catch((er) => console.log(er));
	};
	//#endregion

	useEffect(() => {
		setDataCalendarDashboard(dataLichDashboard ?? []);
	}, [dataLichDashboard?.length]);

	useEffect(() => {
		getData();
	}, []);

	const renderContent = () => {
		// Convert dữ liệu
		const data = dataCalendarDashboard?.reduce<any>((result, item) => {
			if (!item?.thoiGianBatDau) {
				return result;
			}
			const ngayMoment = moment(item?.thoiGianBatDau);
			const ngayString = ngayMoment.format('YYYY-MM-DD');

			return {
				...result,
				[ngayString]: {
					thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayMoment.toDate().getDay()],
					cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
						...item,
						tenSuKien: item.title,
						diaDiem: item.phongHoc ?? item.diaDiem,
					}),
				},
			};
		}, {});

		const keysSorted = sortBy(Object.keys(data));
		if (!loadingSuKien && !loadingSuKien && isEmpty(data)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có sự kiện' />;
		}

		return keysSorted.map((ngay) => {
			const { cacSuKien, thuTrongTuan } = data[ngay];
			const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau));
			return (
				<div key={ngay} className={styles.ngay}>
					<Space style={{ marginBottom: 8 }}>
						<Badge count={cacSuKien.length} size='small' offset={[15, 11]} color='#D66'>
							<div className={styles.ngay__title}>
								{thuTrongTuan}, ngày {moment(ngay).format('DD/MM')}
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
								<div className={styles.su_kien__thoi_gian}>{moment(sukien.thoiGianBatDau).format('HH:mm')}</div>
							</div>
							<Space
								className={styles.su_kien__right}
								style={{
									borderColor:
										recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ??
										ColorSuKien[sukien.loaiSuKien as ELoaiSuKien],
								}}
							>
								<div>{[sukien.tenSuKien ?? '', sukien.diaDiem ?? ''].filter(Boolean).join(' - ')}</div>
								{sukien.loaiSuKien === ELoaiSuKien.LICH_HOC && sukien.hinhThucGiangDay === EHinhThucGiangDay.ONLINE && (
									<Tag color={colorHinhThucGiangDay[sukien.hinhThucGiangDay as EHinhThucGiangDay]}>
										{sukien.hinhThucGiangDay}
									</Tag>
								)}
							</Space>
						</div>
					))}
				</div>
			);
		});
	};

	const getTitle = (event: any) => {
		return (
			<div style={{ fontSize: 12 }}>{[event.tenSuKien ?? '', event.diaDiem ?? ''].filter(Boolean).join(' - ')}</div>
		);
	};

	const renderContentCalender = () => {
		return dataCalendarDashboard?.length ? (
			<DnDCalendar
				localizer={localizer}
				events={
					dataCalendarDashboard?.map((event) => {
						return {
							...event,
							tenSuKien: event.title,
							start: moment(event?.thoiGianBatDau).toDate(),
							end: moment(event?.thoiGianKetThuc).toDate(),
						};
					}) ?? []
				}
				defaultView='week'
				scrollToTime={new Date(1970, 1, 1, 6)}
				date={moment().startOf('week').toDate()}
				onSelectEvent={(event: any) => {
					setSelectEvent(event);
					setVisibleDetail(true);
				}}
				selectable={false}
				min={moment('0700', 'HHmm').toDate()}
				// max={moment('2359', 'HHmm').toDate()}
				popup
				eventPropGetter={(event: any) => ({
					style: {
						backgroundColor:
							recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === event.loaiSuKien)?.maMau ??
							ColorSuKien[event.loaiSuKien as ELoaiSuKien],
					},
				})}
				titleAccessor={(event) => getTitle(event) as any}
				toolbar={false}
			/>
		) : (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có sự kiện' />
		);
	};

	return (
		<>
			<Card
				className={styles.dashboard_calendar}
				loading={loadingSuKien || loadingTKB || loadingThi}
				title={
					<div className={styles.title}>
						<Space>
							<Typography.Text>Sắp diễn ra</Typography.Text>
							<Segmented
								value={segmentSelected}
								options={[
									{ icon: <MenuOutlined />, value: 'list', title: 'Dạng danh sách' },
									{ icon: <CalendarOutlined />, value: 'calendar', title: 'Dạng lịch tuần' },
								]}
								size='small'
								onChange={(val) => {
									localStorage.setItem('loaiLich', val.toString());
									setSegmentSelected(val.toString());
								}}
							/>
						</Space>
						<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
							Xem thêm <ArrowRightOutlined />
						</Link>
					</div>
				}
			>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<div style={{ maxHeight: 450, overflowY: 'auto' }}>
							{segmentSelected === 'list' ? renderContent() : renderContentCalender()}
						</div>
					</Col>
					{!isEmpty(dataLichDashboard) ? (
						<Col span={24}>
							<GhiChuLich />
						</Col>
					) : null}
				</Row>
			</Card>

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
		</>
	);
};

export default LichDashboard;
