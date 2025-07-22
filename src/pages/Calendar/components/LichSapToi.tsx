import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { ClockCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

const { Text } = Typography;

interface LichSapToiProps {
	dataCalendar: any[];
	limit?: number;
	onEventClick?: (event: any) => void;
	setExpandMiniCalendar?: (event: any) => void;
}

const LichSapToi: React.FC<LichSapToiProps> = ({ dataCalendar, limit = 5, onEventClick, setExpandMiniCalendar }) => {
	const [expandLichSapToi, setExpandLichSapToi] = useState(true);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const contentRef = useRef<HTMLDivElement>(null);

	// Lọc và sắp xếp lịch sắp tới
	const upcomingEvents = dataCalendar
		.filter((event) => moment(event.start).isAfter(moment()))
		.sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf())
		.slice(0, limit);

	// Update content height when events change
	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, [upcomingEvents]);

	const formatTime = (start: Date, end: Date) => {
		const startMoment = moment(start);
		const endMoment = moment(end);

		if (startMoment.isSame(endMoment, 'day')) {
			return `${startMoment.format('HH:mm')} - ${endMoment.format('HH:mm')}`;
		}
		return `${startMoment.format('HH:mm')} - ${endMoment.format('DD/MM HH:mm')}`;
	};

	const getEventColor = (loaiSuKien: string) => {
		return ColorSuKien?.[loaiSuKien as ELoaiSuKien] || '#1890ff';
	};

	const getLoaiSuKienText = (loaiSuKien: string) => {
		switch (loaiSuKien) {
			case ELoaiSuKien.LICH_HOC:
				return 'Lịch học';
			case ELoaiSuKien.LICH_THI:
				return 'Lịch thi';
			case ELoaiSuKien.BAI_TAP:
				return 'Bài tập';
			case ELoaiSuKien.CHUNG:
				return 'Sự kiện chung';
			case ELoaiSuKien.CA_NHAN:
				return 'Sự kiện cá nhân';
			default:
				return 'Khác';
		}
	};

	return (
		<Card size='small' style={{ height: '100%', border: 'none', padding: 0, margin: '0 -16px' }}>
			{/* Header Section - Improved */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: '16px',
					cursor: 'pointer',
				}}
				onClick={() => setExpandLichSapToi(!expandLichSapToi)}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '16px' }}>
					Lịch sắp tới
				</div>

				<Button
					type='text'
					size='small'
					icon={
						expandLichSapToi ? (
							<UpOutlined
								style={{
									transition: 'all 0.3s ease',
									fontSize: '12px',
									fontWeight: 600,
								}}
							/>
						) : (
							<DownOutlined
								style={{
									transition: 'all 0.3s ease',
									fontSize: '12px',
									fontWeight: 600,
								}}
							/>
						)
					}
					onClick={() => setExpandLichSapToi(!expandLichSapToi)}
					style={{
						borderRadius: '6px',
						height: '28px',
						width: '28px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transition: 'all 0.3s ease',
					}}
				/>
			</div>

			{upcomingEvents.length === 0 ? (
				<div
					style={{
						textAlign: 'center',
						color: '#999',
						padding: '20px',
						maxHeight: expandLichSapToi ? '200px' : '0px',
						opacity: expandLichSapToi ? 1 : 0,
						overflow: 'hidden',
						transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					}}
				>
					<ClockCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
					<div>Không có lịch sắp tới</div>
				</div>
			) : (
				<div
					style={{
						maxHeight: expandLichSapToi ? `${contentHeight}px` : '0px',
						opacity: expandLichSapToi ? 1 : 0,
						overflow: 'hidden',
						transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					}}
				>
					<div ref={contentRef}>
						<List
							size='small'
							dataSource={upcomingEvents}
							renderItem={(event, index) => (
								<List.Item
									style={{
										padding: '4px',
										border: 'none',
										marginBottom: '16px',
										opacity: expandLichSapToi ? 1 : 0,
										transform: expandLichSapToi ? 'translateY(0)' : 'translateY(-10px)',
										transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
									}}
								>
									<div
										style={{
											width: '100%',
											padding: '16px 20px',
											boxShadow: '0px 0px 12px 0px #00000012',
											borderRadius: 8,
											cursor: 'pointer', // Thêm cursor pointer
										}}
										onClick={() => onEventClick?.(event)} // Thêm onClick handler
									>
										{/* Date and Time Row */}
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												marginBottom: '16px',
												gap: '8px',
											}}
										>
											<div
												style={{
													width: '8px',
													height: '8px',
													borderRadius: '50%',
													backgroundColor: '#1890ff',
													flexShrink: 0,
												}}
											/>
											<Text
												style={{
													fontSize: '14px',
													fontWeight: '500',
													color: '#262626',
												}}
											>
												{moment(event.start).format('DD/MM/YYYY')}
											</Text>
											<div
												style={{
													backgroundColor: '#f6ffed',
													border: '1px solid #b7eb8f',
													borderRadius: '4px',
													padding: '0px 6px',
													marginLeft: 'auto',
												}}
											>
												<Text
													style={{
														fontSize: '12px',
														color: '#52c41a',
														fontWeight: '400',
													}}
												>
													{formatTime(event.start, event.end)}
												</Text>
											</div>
										</div>

										{/* Event Title */}
										<div>
											<Text
												style={{
													fontSize: '14px',
													fontWeight: '600',
													display: 'block',
													color: '#262626',
													lineHeight: '1.5',
												}}
											>
												{event.title}
											</Text>
										</div>
									</div>
								</List.Item>
							)}
						/>
					</div>
				</div>
			)}
		</Card>
	);
};

export default LichSapToi;
