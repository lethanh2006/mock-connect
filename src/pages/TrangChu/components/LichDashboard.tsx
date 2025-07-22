import XemTatCaLink from '@/pages/TrangChu/components/ViewMore';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Card, Modal, Space, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SlideButtonIcon from './SlideButtonIcon';

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

		// Responsive dimensions cho calendar
		const getDimensions = () => {
			if (isMobile) {
				return {
					dateSize: weeks.length > 5 ? 20 : 24,
					fontSize: weeks.length > 5 ? 10 : 11,
					dotSize: 3,
					dotHeight: weeks.length > 5 ? '6px' : '8px',
					padding: '0 8px',
					headerPadding: '12px 8px 8px',
					minHeight: 200,
					dayHeaderSize: 10,
				};
			} else if (isTablet) {
				return {
					dateSize: weeks.length > 5 ? 22 : 26,
					fontSize: weeks.length > 5 ? 11 : 12,
					dotSize: 3.5,
					dotHeight: weeks.length > 5 ? '7px' : '9px',
					padding: '0 15px',
					headerPadding: '16px 15px 12px',
					minHeight: 220,
					dayHeaderSize: 10,
				};
			} else {
				return {
					dateSize: weeks.length > 5 ? 24 : 28,
					fontSize: weeks.length > 5 ? 12 : 13,
					dotSize: 4,
					dotHeight: weeks.length > 5 ? '8px' : '10px',
					padding: '0 20px',
					headerPadding: '20px 20px 16px',
					minHeight: 255,
					dayHeaderSize: 11,
				};
			}
		};

		const dimensions = getDimensions();

		return (
			<div
				style={{
					backgroundColor: '#fff',
					borderRadius: 8,
					height: '100%',
					minHeight: '100%',
					marginTop: -16,
					marginBottom: 16,
					overflow: 'hidden',
					boxShadow: '0px 0px 6px 0px #0000000A',
				}}
			>
				{/* Header với tên tháng và navigation */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: dimensions.headerPadding,
						marginBottom: '8px',
						flexWrap: 'wrap',
					}}
				>
					<Typography.Title
						level={isMobile ? 5 : 5}
						style={{
							margin: '0 8px',
							fontWeight: 600,
							fontSize: isMobile ? 14 : 16,
						}}
					>
						Tháng {currentMonth.format('M/YYYY')}
					</Typography.Title>
					<div style={{ display: 'flex', gap: isMobile ? 4 : 0 }}>
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
				<div style={{ display: 'flex', height: '20px', padding: dimensions.padding }}>
					{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
						<div
							key={day}
							style={{
								flex: 1,
								textAlign: 'center',
								color: '#999',
								fontSize: dimensions.dayHeaderSize,
								fontWeight: 500,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid với chiều cao cố định */}
				<div
					style={{
						flex: 1,
						padding: dimensions.padding,
						minHeight: dimensions.minHeight,
						paddingBottom: isMobile ? 8 : 20,
					}}
				>
					{weeks.map((week, weekIndex) => (
						<div
							key={weekIndex}
							style={{
								display: 'flex',
								height: `calc(100% / ${weeks.length})`,
								minHeight: isMobile ? '25px' : '30px',
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
										style={{
											flex: 1,
											padding: isMobile ? '1px 0.5px' : '2px 1px',
											cursor: 'pointer',
											position: 'relative',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}
										onClick={() => {
											setSelectedDate(date);
											if (events.length > 0) {
												setSelectedEvents(events);
												setVisibleDetail(true);
											}
										}}
									>
										<div
											style={{
												width: dimensions.dateSize,
												height: dimensions.dateSize,
												borderRadius: 4,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												marginBottom: '2px',
												fontSize: dimensions.fontSize,
												fontWeight: isToday ? 600 : 'normal',
												backgroundColor: isToday ? '#d32f2f' : isSelected ? '#f0f0f0' : 'transparent',
												color: isToday ? '#fff' : isCurrentMonth ? '#333' : '#ccc',
											}}
										>
											{date.format('DD')}
										</div>

										{/* Vùng hiển thị dấu chấm với chiều cao cố định */}
										<div
											style={{
												height: dimensions.dotHeight,
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'flex-start',
												gap: 1,
												flexWrap: 'wrap',
											}}
										>
											{events.length > 0 ? (
												<>
													{events.slice(0, isMobile ? 3 : 4).map((event, index) => (
														<div
															key={index}
															style={{
																width: dimensions.dotSize,
																height: dimensions.dotSize,
																borderRadius: '50%',
																backgroundColor: getEventColor(event.loaiSuKien), // Sử dụng hàm helper
															}}
														/>
													))}
													{events.length > (isMobile ? 3 : 4) && (
														<div
															style={{
																fontSize: isMobile ? 8 : 9,
																color: '#666',
																marginLeft: 1,
															}}
														>
															+{events.length - (isMobile ? 3 : 4)}
														</div>
													)}
												</>
											) : (
												<div style={{ height: '3px' }} />
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
				style={{
					borderRadius: 8,
					backgroundColor: 'transparent',
					border: 'none',
					minHeight: 350,
					height: 350,
					marginRight: '-16px',
				}}
				loading={loadingSuKien || loadingTKB || loadingThi}
				headStyle={{
					borderBottom: 'none',
				}}
				title={
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							backgroundColor: 'transparent',
							borderBottom: 'none',
						}}
					>
						<Space>
							<Typography.Text style={{ fontSize: 18 }}>Lịch</Typography.Text>
						</Space>
						<XemTatCaLink to='/calendar' />
					</div>
				}
			>
				{renderCalendar()}
			</Card>

			{/* Modal xem chi tiết sự kiện */}
			<Modal
				title={`Sự kiện ngày ${selectedDate.format('DD/MM/YYYY')}`}
				visible={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
				footer={null}
				width={600}
			>
				<div style={{ maxHeight: 400, overflowY: 'auto' }}>
					{selectedEvents.map((event, index) => (
						<div
							key={index}
							style={{
								padding: 12,
								border: '1px solid #f0f0f0',
								borderRadius: 4,
								borderLeft: `4px solid ${getEventColor(event.loaiSuKien)}`, // Sử dụng hàm helper
								marginBottom: index < selectedEvents.length - 1 ? 8 : 0,
							}}
						>
							<div style={{ fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
							<div style={{ fontSize: 12, color: '#666' }}>
								{moment(event.thoiGianBatDau).format('HH:mm')} - {moment(event.thoiGianKetThuc).format('HH:mm')}
							</div>
							{event.diaDiem && <div style={{ fontSize: 12, color: '#666' }}>📍 {event.diaDiem}</div>}
						</div>
					))}
				</div>
			</Modal>
		</>
	);
};

export default LichDashboard;
