import ButtonExtend from '@/components/Table/ButtonExtend';
import { colorHinhThucGiangDay, EHinhThucGiangDay, mapHinhThucGiangDayI18n } from '@/services/HocTap/constant';
import { ColorSuKien, ELoaiSuKien, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { ArrowRightOutlined, CalendarOutlined, InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Empty, Modal, Popover, Row, Segmented, Space, Tag, Typography } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from 'react-responsive';
import { Link, useIntl, useModel } from 'umi';
import FormLichCaNhan from '../components/FormLichCaNhan';
import GhiChuLich from '../components/GhiChuLich';
import ModalViewDetailCalendar from '../components/ModalViewDetail';
import styles from './styles.less';

const tmp: any = Calendar;
const DnDCalendar = withDragAndDrop(tmp);

const getThoiGianMotTuanKeTuHomNay = () => {
	return {
		fromDate: dayjs().startOf('week').toISOString(),
		toDate: dayjs().add(7, 'day').endOf('day').toISOString(),
	};
};

const LichDashboard = () => {
	const intl = useIntl();
	const {
		visibleForm,
		setVisibleForm,
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		setDataLichDashboard,
		dataLichDashboard,
		dataCalendarDashboard,
		setDataCalendarDashboard,
		edit,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();
	const localizer = dayjsLocalizer(dayjs);
	const [segmentSelected, setSegmentSelected] = useState<string>(localStorage.getItem('loaiLich') ?? 'list');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			return data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				suffix: [item?.lopHocPhan?.ten, item?.phongHoc].filter(Boolean).join(', '),
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			}));
		});
	};

	const getLichThi = async () => {
		return getLichThiModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			return data.map((item) => ({
				...item,
				title: `Lịch thi: ${item.danhSachHocPhan?.map((i) => i.ten).join(', ')}`,
				suffix: item.phong?.ma ?? '',
				loaiSuKien: ELoaiSuKien.LICH_THI,
			}));
		});
	};

	const getSuKien = async () => {
		return getSuKienTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			return data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
			}));
		});
	};

	const getBaiTap = async () => {
		return thongKeBaiTapModel(
			dayjs().startOf('week').toISOString(),
			dayjs().add(2, 'months').endOf('day').toISOString(),
		).then((data) => {
			const aWeekLater = dayjs().add(7, 'day').endOf('day').toDate();
			return data
				.map((item) => ({
					...item,
					title: item?.assignment?.noiDung ?? '',
					suffix: item?.assignment?.tenLopHocPhan,
					thoiGianBatDau: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
					thoiGianKetThuc: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
					loaiSuKien: ELoaiSuKien.BAI_TAP,
				}))
				.filter((i) => i.thoiGianKetThuc < aWeekLater);
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

	useEffect(() => {
		setDataCalendarDashboard(dataLichDashboard ?? []);
	}, [dataLichDashboard?.length]);

	useEffect(() => {
		getData();
	}, []);

	const renderContent = () => {
		const data = dataCalendarDashboard
			?.filter((event) => dayjs(event.thoiGianBatDau).isSameOrAfter(dayjs(), 'day'))
			?.reduce<any>((result, item) => {
				if (!item?.thoiGianBatDau) return result;
				const ngay = dayjs(item.thoiGianBatDau);
				const ngayString = ngay.format('YYYY-MM-DD');
				return {
					...result,
					[ngayString]: {
						thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngay.toDate().getDay()],
						cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
							...item,
							tenSuKien: item.title,
							suffix: item.suffix ?? item.diaDiem,
						}),
					},
				};
			}, {});

		const keysSorted = sortBy(Object.keys(data));
		if (!loadingSuKien && isEmpty(data)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có sự kiện' />;
		}

		return keysSorted.map((ngay) => {
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
								{thuTrongTuan}, ngày {formatDate(ngay, 'DD/MM')}
							</div>
						</Badge>
					</Space>
					{cacSuKienSorted.map((sukien) => (
						<div
							key={sukien._id}
							className={`${styles.su_kien} ${dayjs().isSame(ngay, 'day') ? styles.today : ''}`}
							onClick={() => {
								setSelectEvent(sukien);
								setVisibleDetail(true);
							}}
						>
							<div className={styles.su_kien__left}>
								{dayjs().isSameOrAfter(sukien.thoiGianBatDau) && dayjs().isSameOrBefore(sukien.thoiGianKetThuc) && (
									<div className={styles.pulse} />
								)}
								<div className={styles.su_kien__thoi_gian}>{formatDate(sukien.thoiGianBatDau, 'HH:mm')}</div>
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
								{sukien.loaiSuKien === ELoaiSuKien.LICH_HOC && sukien.hinhThucGiangDay === EHinhThucGiangDay.ONLINE && (
									<Tag color={colorHinhThucGiangDay[sukien.hinhThucGiangDay as EHinhThucGiangDay]}>
										{intl.formatMessage({
											id: mapHinhThucGiangDayI18n[sukien.hinhThucGiangDay as EHinhThucGiangDay],
										})}
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
					dataCalendarDashboard?.map((event) => ({
						...event,
						tenSuKien: event.title,
						start: dayjs(event.thoiGianBatDau).toDate(),
						end: dayjs(event.thoiGianKetThuc).toDate(),
					})) ?? []
				}
				defaultView='week'
				scrollToTime={new Date(1970, 1, 1, 6)}
				date={dayjs().startOf('week').toDate()}
				onSelectEvent={(event: any) => {
					setSelectEvent(event);
					setVisibleDetail(true);
				}}
				selectable={false}
				min={dayjs('0700', 'HHmm').toDate()}
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
							{!isEmpty(dataLichDashboard) ? (
								<Popover
									content={
										<div style={{ maxWidth: 350 }}>
											<GhiChuLich />
										</div>
									}
									placement={isMobile ? 'bottom' : 'right'}
									title='Chọn lịch hiển thị'
								>
									<ButtonExtend type='link' icon={<InfoCircleOutlined />} />
								</Popover>
							) : null}
						</Space>
						<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
							Xem thêm <ArrowRightOutlined />
						</Link>
					</div>
				}
			>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<div style={{ maxHeight: 400, overflowY: 'auto' }}>
							{segmentSelected === 'list' ? renderContent() : renderContentCalender()}
						</div>
					</Col>
				</Row>
			</Card>

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
				title={edit ? 'Chỉnh sửa sự kiện' : 'Thêm mới sự kiện'}
			>
				<FormLichCaNhan getData={getData} />
			</Modal>

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
