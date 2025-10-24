import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { Button, Card, Modal, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';

import FormLichCaNhan from '@/pages/Calendar/components/FormLichCaNhan';
import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import SlideButtonIcon from '../SlideButtonIcon';
import './style.less';

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
	const [selectedDate, setSelectedDate] = useState(dayjs());
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [visibleDetailEvent, setVisibleDetailEvent] = useState(false);
	const [selectedEvents, setSelectedEvents] = useState<SuKienItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectEvent, setSelectEvent] = useState<SuKienItem | null>(null);

	// Cache để lưu dữ liệu theo tháng
	const cacheRef = useRef<Record<string, SuKienItem[]>>({});
	// Set để track các tháng đang được fetch (tránh duplicate calls)
	const fetchingRef = useRef<Set<string>>(new Set());

	const screenSize = useScreenSize();
	const isMobile = screenSize.width <= 768;
	const isTablet = screenSize.width > 768 && screenSize.width <= 1024;

	const { getSuKienTrongKhoangModel, dataLichDashboard, setDataLichDashboard, visibleForm, setVisibleForm, edit } =
		useModel('sukien.sukien');
	const { getTrongKhoangModel } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');

	// Get khoảng thời gian hiển thị dựa trên tháng hiện tại +- 1 tuần
	const getKhoangThoiGian = (month = currentMonth) => ({
		fromDate: month.startOf('month').startOf('week').subtract(1, 'week').toISOString(),
		toDate: month.endOf('month').endOf('week').add(1, 'week').toISOString(),
	});

	const getThoiKhoaBieu = async (timeRange: { fromDate: string; toDate: string }) => {
		return getTrongKhoangModel(timeRange).then((data) => {
			return data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				suffix: [item?.lopHocPhan?.ten, item?.phongHoc].filter(Boolean).join(', '),
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			}));
		});
	};

	const getLichThi = async (timeRange: { fromDate: string; toDate: string }) => {
		return getLichThiModel(timeRange).then((data) => {
			return data.map((item) => ({
				...item,
				title: `Lịch thi: ${item.danhSachHocPhan?.map((i) => i.ten).join(', ')}`,
				suffix: item.phong?.ma ?? '',
				loaiSuKien: ELoaiSuKien.LICH_THI,
			}));
		});
	};

	const getSuKien = async (timeRange: { fromDate: string; toDate: string }) => {
		return getSuKienTrongKhoangModel(timeRange).then((data) => {
			return data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
			}));
		});
	};

	const getBaiTap = async (timeRange: { fromDate: string; toDate: string }) => {
		return thongKeBaiTapModel(timeRange.fromDate, timeRange.toDate).then((data) => {
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

	const getData = async (month?: dayjs.Dayjs) => {
		const timeRange = month ? getKhoangThoiGian(month) : getKhoangThoiGian();
		const promises = [getThoiKhoaBieu(timeRange), getSuKien(timeRange), getLichThi(timeRange), getBaiTap(timeRange)];

		return Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				return responses.flat().filter(Boolean);
			})
			.catch((er) => {
				console.error('Error fetching data:', er);
				return [];
			});
	};

	// Hàm load dữ liệu cho một tháng với cache
	const loadMonthData = async (month: dayjs.Dayjs) => {
		const monthKey = month.format('YYYY-MM');

		// Nếu đã có trong cache, return ngay
		if (cacheRef.current[monthKey]) {
			return cacheRef.current[monthKey];
		}

		// Nếu đang fetch, đợi để tránh duplicate calls
		if (fetchingRef.current.has(monthKey)) {
			return new Promise<SuKienItem[]>((resolve) => {
				const checkInterval = setInterval(() => {
					if (cacheRef.current[monthKey]) {
						clearInterval(checkInterval);
						resolve(cacheRef.current[monthKey]);
					}
				}, 100);

				// Timeout sau 10 giây để tránh infinite loop
				setTimeout(() => {
					clearInterval(checkInterval);
					resolve([]);
				}, 10000);
			});
		}

		// Đánh dấu đang fetch
		fetchingRef.current.add(monthKey);

		try {
			const data = await getData(month);
			cacheRef.current[monthKey] = data;
			return data;
		} catch (error) {
			console.error('Error loading month data:', error);
			return [];
		} finally {
			fetchingRef.current.delete(monthKey);
		}
	};

	// Load dữ liệu khi đổi tháng
	useEffect(() => {
		const loadCurrentMonth = async () => {
			setLoading(true);
			try {
				const data = await loadMonthData(currentMonth);
				setDataLichDashboard(data);

				// Bỏ preload tháng kế tiếp và tháng trước
				// setTimeout(() => {
				// 	loadMonthData(currentMonth.add(1, 'month'));
				// }, 500);

				// setTimeout(() => {
				// 	loadMonthData(currentMonth.subtract(1, 'month'));
				// }, 1000);
			} finally {
				setLoading(false);
			}
		};

		loadCurrentMonth();
	}, [currentMonth]);

	const getEventsForDate = (date: dayjs.Dayjs): SuKienItem[] => {
		return (dataLichDashboard || []).filter(
			(event) => dayjs(event.thoiGianBatDau).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'),
		);
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

		// Xác định responsive class names\
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
							disabled={loading}
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' />}
							onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
							size={isMobile ? 'small' : 'middle'}
							className='nav-btn'
							disabled={loading}
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
																backgroundColor: getEventColor(event.loaiSuKien),
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

	const handleViewDetail = (event: SuKienItem) => {
		setSelectEvent(event);
		setVisibleDetailEvent(true);
	};

	return (
		<>
			<Card
				variant='borderless'
				className='card-borderless card-big-title'
				loading={loading}
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

			{/* Modal xem list sự kiện */}
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
								borderLeftColor: getEventColor(event?.loaiSuKien),
							}}
							onClick={() => handleViewDetail(event)}
						>
							<div className='event-title'>{event.title}</div>
							<div className='event-time'>
								{dayjs(event.thoiGianBatDau).format('HH:mm')} - {dayjs(event.thoiGianKetThuc).format('HH:mm')}
							</div>
							{event.diaDiem && <div className='event-location'>📍 {event.diaDiem}</div>}
						</div>
					))}
				</div>

				<div className='form-footer'>
					<Button onClick={() => setVisibleDetail(false)}>Đóng</Button>
				</div>
			</Modal>

			{/* Modal xem chi tiết sự kiện */}
			{selectEvent && (
				<ModalViewDetailCalendar
					visible={visibleDetailEvent}
					setVisible={setVisibleDetailEvent}
					event={selectEvent}
					getData={getData}
				/>
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
		</>
	);
};

export default LichDashboard;
