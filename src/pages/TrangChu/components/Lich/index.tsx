import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Card, Modal, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

import SlideButtonIcon from '../SlideButtonIcon';
import './style.less';

// Type definitions
interface SuKienItem {
	_id: string;
	title: string;
	loaiSuKien: string;
	hinhThucGiangDay?: string;
	thoiGianBatDau: string;
	thoiGianKetThuc: string;
	diaDiem: string;
	suffix: string;
}

// Hook để detect screen size
const useScreenSize = () => {
	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return screenSize;
};

// Hàm helper để lấy màu sắc với fallback
const getEventColor = (loaiSuKien: string): string => {
	return ColorSuKien[loaiSuKien as keyof typeof ColorSuKien] || '#666666';
};

const LichDashboard = () => {
	const [currentMonth, setCurrentMonth] = useState(moment());
	const [selectedDate, setSelectedDate] = useState(moment());
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [selectedEvents, setSelectedEvents] = useState<SuKienItem[]>([]);

	const screenSize = useScreenSize();
	const isMobile = screenSize.width <= 768;
	const isTablet = screenSize.width > 768 && screenSize.width <= 1024;

	// Sử dụng useModel để lấy dữ liệu từ API
	const {
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		dataLichDashboard,
		setDataLichDashboard,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');

	// Logic API từ code gốc
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
				// Giữ nguyên loaiSuKien từ API
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

	// Lấy dữ liệu khi component mount
	useEffect(() => {
		getData();
	}, []);

	// Lấy các sự kiện theo ngày - SỬ DỤNG TRỰC TIẾP dataLichDashboard
	const getEventsForDate = (date: moment.Moment): SuKienItem[] => {
		const events = (dataLichDashboard || []).filter(
			(event) => moment(event.thoiGianBatDau).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
		);

		return events;
	};

	// Tạo calendar grid
	const renderCalendar = () => {
		const startOfMonth = currentMonth.clone().startOf('month');
		const endOfMonth = currentMonth.clone().endOf('month');
		const startDate = startOfMonth.clone().startOf('week');
		const endDate = endOfMonth.clone().endOf('week');

		const dateArray = [];
		const current = startDate.clone();

		while (current.isSameOrBefore(endDate)) {
			dateArray.push(current.clone());
			current.add(1, 'day');
		}

		const weeks = [];
		for (let i = 0; i < dateArray.length; i += 7) {
			weeks.push(dateArray.slice(i, i + 7));
		}

		// Xác định responsive class names
		const getResponsiveClass = () => {
			if (isMobile) return 'mobile';
			if (isTablet) return 'tablet';
			return 'desktop';
		};

		const responsiveClass = getResponsiveClass();
		const isSmallMonth = weeks.length <= 5;

		return (
			<div className='calendar-container'>
				{/* Header với tên tháng và navigation */}
				<div className={`calendar-header ${responsiveClass}`}>
					<Typography.Title level={isMobile ? 5 : 5} className={`calendar-title ${responsiveClass}`}>
						Tháng {currentMonth.format('M/YYYY')}
					</Typography.Title>
					<div className={`calendar-nav ${responsiveClass}`}>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' />}
							onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))}
							size={isMobile ? 'small' : 'middle'}
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' />}
							onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))}
							size={isMobile ? 'small' : 'middle'}
						/>
					</div>
				</div>

				{/* Header ngày trong tuần */}
				<div className={`week-header ${responsiveClass}`}>
					{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
						<div key={day} className={`day-header ${responsiveClass}`}>
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid với chiều cao cố định */}
				<div className={`calendar-grid ${responsiveClass}`}>
					{weeks.map((week, weekIndex) => (
						<div
							key={weekIndex}
							className={`calendar-week ${responsiveClass}`}
							style={{
								height: `calc(100% / ${weeks.length})`,
							}}
						>
							{week.map((date, dayIndex) => {
								const events = getEventsForDate(date);
								const isCurrentMonth = date.month() === currentMonth.month();
								const isToday = date.isSame(moment(), 'day');
								const isSelected = date.isSame(selectedDate, 'day');

								return (
									<div
										key={dayIndex}
										className={`date-cell ${responsiveClass}`}
										onClick={() => {
											setSelectedDate(date);
											if (events.length > 0) {
												setSelectedEvents(events);
												setVisibleDetail(true);
											}
										}}
									>
										<div
											className={`date-number ${responsiveClass} ${isSmallMonth ? 'small-month' : ''} ${
												isToday ? 'today' : ''
											} ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current-month' : 'other-month'}`}
										>
											{date.format('DD')}
										</div>

										{/* Vùng hiển thị dấu chấm với chiều cao cố định */}
										<div className={`event-dots-container ${responsiveClass} ${isSmallMonth ? 'small-month' : ''}`}>
											{events.length > 0 ? (
												<>
													{events.slice(0, isMobile ? 3 : 4).map((event, index) => (
														<div
															key={index}
															className={`event-dot ${responsiveClass}`}
															style={{
																backgroundColor: getEventColor(event.loaiSuKien), // Sử dụng hàm helper
															}}
														/>
													))}
													{events.length > (isMobile ? 3 : 4) && (
														<div className={`event-more ${responsiveClass}`}>+{events.length - (isMobile ? 3 : 4)}</div>
													)}
												</>
											) : (
												<div className='empty-dot-space' />
											)}
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<>
			<Card
				variant='borderless'
				className='card-borderless card-big-title'
				loading={loadingSuKien || loadingTKB || loadingThi}
				title='Lịch'
				extra={
					<Link to='/calendar' className='xem-tat-ca-link'>
						Xem tất cả
					</Link>
				}
			>
				<Card variant='borderless' className='calendar-card'>
					{renderCalendar()}
				</Card>
			</Card>

			{/* Modal xem chi tiết sự kiện */}
			<Modal
				title={`Sự kiện ngày ${selectedDate.format('DD/MM/YYYY')}`}
				visible={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
				footer={null}
				width={600}
				className='event-modal'
			>
				<div>
					{selectedEvents.map((event, index) => (
						<div
							key={index}
							className='event-item'
							style={{
								borderLeftColor: getEventColor(event.loaiSuKien), // Sử dụng hàm helper
							}}
						>
							<div className='event-title'>{event.title}</div>
							<div className='event-time'>
								{moment(event.thoiGianBatDau).format('HH:mm')} - {moment(event.thoiGianKetThuc).format('HH:mm')}
							</div>
							{event.diaDiem && <div className='event-location'>📍 {event.diaDiem}</div>}
						</div>
					))}
				</div>
			</Modal>
		</>
	);
};

export default LichDashboard;
