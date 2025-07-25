import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SlideButtonIcon from '../SlideButtonIcon';
import './style.less';

const { Title } = Typography;

const CardSuKienSapToi = () => {
	const {
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		dataLichDashboard,
		setDataLichDashboard,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { record: recSetting } = useModel('tienich.settinglich');

	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();
	const [currentIndex, setCurrentIndex] = useState(0);

	const getThoiGianMotTuanKeTuHomNay = () => {
		return {
			fromDate: moment().startOf('week').toISOString(),
			toDate: moment().add(7, 'day').endOf('day').toISOString(),
		};
	};

	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				suffix: [item?.lopHocPhan?.ten, item?.phongHoc].filter(Boolean).join(', '),
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
				suffix: item.phong?.ma ?? '',
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
			moment().startOf('week').toISOString(),
			moment().add(2, 'months').endOf('day').toISOString(),
		).then((data) => {
			const aWeekLater = moment().add(7, 'day').endOf('day').toDate();
			const temp = data
				.map((item) => ({
					...item,
					title: item?.assignment?.noiDung ?? '',
					suffix: item?.assignment?.tenLopHocPhan,
					thoiGianBatDau: moment(item?.assignment?.thoiGianKetThuc).toDate(),
					thoiGianKetThuc: moment(item?.assignment?.thoiGianKetThuc).toDate(),
					loaiSuKien: ELoaiSuKien.BAI_TAP,
				}))
				.filter((i) => i.thoiGianKetThuc < aWeekLater);
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

	useEffect(() => {
		getData();
	}, []);

	// Lấy sự kiện sắp tới (trong vòng 24h tới)
	const getSuKienSapToi = () => {
		// Sử dụng dữ liệu thực nếu có, không thì dùng dữ liệu mẫu
		const dataToUse = dataLichDashboard;

		if (!dataToUse?.length) return [];

		const now = moment();
		const next24Hours = moment().add(24, 'hours');

		return dataToUse
			.filter((event) => {
				const eventTime = moment(event.thoiGianBatDau);
				return eventTime.isAfter(now) && eventTime.isBefore(next24Hours);
			})
			.sort((a, b) => moment(a.thoiGianBatDau).diff(moment(b.thoiGianBatDau)));
	};

	const handlePrevious = () => {
		const suKienSapToi = getSuKienSapToi();
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : suKienSapToi.length - 1));
	};

	const handleNext = () => {
		const suKienSapToi = getSuKienSapToi();
		setCurrentIndex((prev) => (prev < suKienSapToi.length - 1 ? prev + 1 : 0));
	};

	const handleEventClick = (event: any) => {
		setSelectEvent(event);
		setVisibleDetail(true);
	};

	const renderCurrentEvent = () => {
		const suKienSapToi = getSuKienSapToi();

		if (isEmpty(suKienSapToi)) {
			return (
				<div className='event-empty'>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
				</div>
			);
		}

		const currentEvent = suKienSapToi[currentIndex];
		if (!currentEvent) return null;

		return (
			<div
				key={currentEvent?._id || currentIndex}
				className={`event-card fade-in`}
				onClick={() => handleEventClick(currentEvent)}
			>
				<div className='event-content'>
					<div className='event-details'>
						<div className='event-title'>{currentEvent.title || currentEvent.tenSuKien}</div>

						{/* {currentEvent.suffix && (
							<div className="event-suffix">
								{currentEvent.suffix}
							</div>
						)} */}
						<div className='event-footer'>
							{/* <div className="event-time">
                                {moment(currentEvent.thoiGianBatDau).format('HH:mm')}
                            </div> */}
							<div className='event-date'>{moment(currentEvent.thoiGianBatDau).format('DD/MM/YYYY')}</div>
							<div className='event-tags'>
								<Space size={4} wrap>
									<Tag
										color={
											recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === currentEvent.loaiSuKien)
												?.maMau ?? ColorSuKien[currentEvent.loaiSuKien as ELoaiSuKien]
										}
										style={{ fontSize: 11 }}
									>
										{currentEvent.loaiSuKien}
									</Tag>

									{currentEvent?.isQRDangKy && (
										<Tag color={currentEvent?.isDangKy ? 'green' : 'red'} style={{ fontSize: 11 }}>
											{currentEvent?.isDangKy ? 'Đã đăng ký' : 'Chưa đăng ký'}
										</Tag>
									)}
								</Space>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<Card
				className='sukien-wrapper'
				variant='borderless'
				loading={loadingSuKien || loadingTKB || loadingThi}
				styles={{ body: { padding: 0 } }}
			>
				{/* Header */}
				<div className='sukien-header'>
					<Title level={4} className='sukien-title'>
						Sự kiện
						{/* {!dataLichDashboard?.length && <span style={{ fontSize: '12px', color: '#999' }}>(Demo)</span>} */}
					</Title>
					<div className='navigation-buttons'>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' disabled={getSuKienSapToi().length <= 1} />}
							onClick={handlePrevious}
							disabled={getSuKienSapToi().length <= 1}
							className='nav-btn'
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' disabled={getSuKienSapToi().length <= 1} />}
							onClick={handleNext}
							disabled={getSuKienSapToi().length <= 1}
							className='nav-btn'
						/>
					</div>
				</div>

				{/* Current Event */}
				{renderCurrentEvent()}
			</Card>

			{/* Modal xem chi tiết sự kiện */}
			{selectEvent && (
				<ModalViewDetailCalendar
					visible={visibleDetail}
					setVisible={setVisibleDetail}
					event={selectEvent}
					getData={getData}
				/>
			)}
		</>
	);
};

export default CardSuKienSapToi;
