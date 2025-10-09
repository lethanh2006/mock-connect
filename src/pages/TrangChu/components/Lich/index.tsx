import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs'; // Import dayjs đã config
import { Button, Card, Modal, Typography } from 'antd';
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
	const [currentMonth, setCurrentMonth] = useState(dayjs());
	const [dateRange, setDateRange] = useState({
		fromDate: currentMonth.startOf('month').startOf('week'),
		toDate: currentMonth.endOf('month').endOf('week'),
	});
	const [preloadedData, setPreloadedData] = useState<Record<string, SuKienItem[]>>({});

	const [selectedDate, setSelectedDate] = useState(dayjs());
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

	// Cập nhật lại range khi đổi tháng
	useEffect(() => {
		setDateRange({
			fromDate: currentMonth.startOf('month').startOf('week'),
			toDate: currentMonth.endOf('month').endOf('week'),
		});
	}, [currentMonth]);

	// Logic API từ code gốc
	const getThoiGianMotTuanKeTuHomNay = () => {
		return {
			fromDate: dayjs().startOf('week').toISOString(),
			toDate: dayjs().add(7, 'day').endOf('day').toISOString(),
		};
	};

	const getKhoangThoiGian = (month = currentMonth) => ({
		fromDate: month.startOf('month').startOf('week').toISOString(),
		toDate: month.endOf('month').endOf('week').toISOString(),
	});

	const getThoiKhoaBieu = async (timeRange?: { fromDate: string; toDate: string }) => {
		const range = timeRange || getKhoangThoiGian();
		return getTrongKhoangModel(range).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				suffix: [item?.lopHocPhan?.ten, item?.phongHoc].filter(Boolean).join(', '),
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			}));
			return temp;
		});
	};

	const getLichThi = async (timeRange?: { fromDate: string; toDate: string }) => {
		const range = timeRange || getKhoangThoiGian();
		return getLichThiModel(range).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `Lịch thi: ${item.danhSachHocPhan?.map((i) => i.ten).join(', ')}`,
				suffix: item.phong?.ma ?? '',
				loaiSuKien: ELoaiSuKien.LICH_THI,
			}));
			return temp;
		});
	};

	const getSuKien = async (timeRange?: { fromDate: string; toDate: string }) => {
		const range = timeRange || getKhoangThoiGian();
		return getSuKienTrongKhoangModel(range).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
				// Giữ nguyên loaiSuKien từ API
			}));
			return temp;
		});
	};

	const getBaiTap = async (timeRange?: { fromDate: string; toDate: string }) => {
		const range = timeRange || getKhoangThoiGian();
		return thongKeBaiTapModel(range.fromDate, range.toDate).then((data) => {
			const aWeekLater = dayjs().add(7, 'day').endOf('day').toDate();
			const temp = data
				.map((item) => ({
					...item,
					title: item?.assignment?.noiDung ?? '',
					suffix: item?.assignment?.tenLopHocPhan,
					thoiGianBatDau: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
					thoiGianKetThuc: dayjs(item?.assignment?.thoiGianKetThuc).toDate(),
					loaiSuKien: ELoaiSuKien.BAI_TAP,
				}))
				.filter((i) => i.thoiGianKetThuc < aWeekLater);
			return temp;
		});
	};

	const getData = (month = currentMonth) => {
		const timeRange = getKhoangThoiGian(month);
		const promises = [getThoiKhoaBieu(timeRange), getSuKien(timeRange), getLichThi(timeRange), getBaiTap(timeRange)];

		return Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				const data = responses.flat();
				return data;
			})
			.catch((er) => {
				console.log(er);
				return [];
			});
	};

	// Lấy dữ liệu khi component mount
	useEffect(() => {
		const currentMonthKey = currentMonth.format('YYYY-MM');

		// Kiểm tra nếu dữ liệu đã được preload
		if (preloadedData[currentMonthKey]) {
			setDataLichDashboard(preloadedData[currentMonthKey]);
		} else {
			// Nếu chưa preload, gọi API
			getData(currentMonth).then((data) => {
				setDataLichDashboard(data);
			});
		}

		// Preload tháng tiếp theo
		const nextMonth = currentMonth.add(1, 'month');
		const nextMonthKey = nextMonth.format('YYYY-MM');
		if (!preloadedData[nextMonthKey]) {
			getData(nextMonth).then((data) => {
				setPreloadedData((prev) => ({
					...prev,
					[nextMonthKey]: data,
				}));
			});
		}

		// Preload tháng trước đó (optional, để khi click back không bị loading)
		const prevMonth = currentMonth.subtract(1, 'month');
		const prevMonthKey = prevMonth.format('YYYY-MM');
		if (!preloadedData[prevMonthKey]) {
			getData(prevMonth).then((data) => {
				setPreloadedData((prev) => ({
					...prev,
					[prevMonthKey]: data,
				}));
			});
		}
	}, [currentMonth, preloadedData]);

	// Lấy các sự kiện theo ngày - SỬ DỤNG TRỰC TIẾP dataLichDashboard
	const getEventsForDate = (date: dayjs.Dayjs): SuKienItem[] => {
		const events = (dataLichDashboard || []).filter(
			(event) => dayjs(event.thoiGianBatDau).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
		);

		return events;
	};

	// Tạo calendar grid
	const renderCalendar = () => {
		const startOfMonth = currentMonth.startOf('month');
		const endOfMonth = currentMonth.endOf('month');
		const startDate = startOfMonth.startOf('week');
		const endDate = endOfMonth.endOf('week');

		const dateArray = [];
		let current = startDate;

		while (current.isSameOrBefore(endDate)) {
			dateArray.push(current);
			current = current.add(1, 'day');
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
			<div className='calendar-dashboard-container'>
				{/* Header với tên tháng và navigation */}
				<div className={`calendar-header ${responsiveClass}`}>
					<Typography.Title level={5} className={`calendar-title ${responsiveClass}`}>
						Tháng {currentMonth.format('M/YYYY')}
					</Typography.Title>
					<div className={`${responsiveClass} navigation-buttons`}>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' />}
							onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
							size={isMobile ? 'small' : 'middle'}
							className='nav-btn'
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' />}
							onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
							size={isMobile ? 'small' : 'middle'}
							className='nav-btn'
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
								const isToday = date.isSame(dayjs(), 'day');
								const isSelected = date.isSame(selectedDate, 'day');
								const isSelectedToday = isToday && isSelected;

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
												isSelectedToday ? 'selected-today' : isToday ? 'today' : isSelected ? 'selected' : ''
											} ${isCurrentMonth ? 'current-month' : 'other-month'}`}
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
				// loading={loadingSuKien || loadingTKB || loadingThi}
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
				open={visibleDetail}
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
								{dayjs(event.thoiGianBatDau).format('HH:mm')} - {dayjs(event.thoiGianKetThuc).format('HH:mm')}
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
