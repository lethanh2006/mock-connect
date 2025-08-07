import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { ClockCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import './style.less';

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

	const cardTitle = (
		<div className='lich-sap-toi-header' onClick={() => setExpandLichSapToi(!expandLichSapToi)}>
			<div className='lich-sap-toi-header-title card-big-title'>Lịch sắp tới</div>

			<Button
				type='text'
				size='small'
				icon={expandLichSapToi ? <UpOutlined /> : <DownOutlined />}
				onClick={(e) => {
					e.stopPropagation();
					setExpandLichSapToi(!expandLichSapToi);
				}}
				className='lich-sap-toi-header-toggle-btn'
			/>
		</div>
	);

	return (
		<Card size='small' className='lich-sap-toi-card card-big-title' title={cardTitle}>
			{upcomingEvents.length === 0 ? (
				<div className={`lich-sap-toi-empty ${expandLichSapToi ? 'expanded' : 'collapsed'}`}>
					<ClockCircleOutlined />
					<div>Không có lịch sắp tới</div>
				</div>
			) : (
				<div
					className={`lich-sap-toi-content ${expandLichSapToi ? 'expanded' : 'collapsed'}`}
					style={{
						maxHeight: expandLichSapToi ? `${contentHeight}px` : '0px',
					}}
				>
					<div ref={contentRef}>
						<List
							size='small'
							dataSource={upcomingEvents}
							renderItem={(event, index) => (
								<List.Item
									className={`lich-sap-toi-list-item ${expandLichSapToi ? 'expanded' : 'collapsed'}`}
									style={{
										transitionDelay: `${index * 0.1}s`,
									}}
								>
									<Card
										className='lich-sap-toi-event-card card card-borderless'
										variant='borderless'
										onClick={() => onEventClick?.(event)}
									>
										{/* Date and Time Row */}
										<div className='lich-sap-toi-event-card-date-row'>
											<div className='lich-sap-toi-event-card-date-row-dot' />
											<Text className='lich-sap-toi-event-card-date-row-date-text'>
												{moment(event.start).format('DD/MM/YYYY')}
											</Text>
											<div className='lich-sap-toi-event-card-date-row-time-badge'>
												<Text className='time-text'>{formatTime(event.start, event.end)}</Text>
											</div>
										</div>

										{/* Event Title */}
										<div>
											<Text className='lich-sap-toi-event-card-title'>{event.title}</Text>
										</div>
									</Card>
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
