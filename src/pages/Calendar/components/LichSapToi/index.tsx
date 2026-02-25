import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { ClockCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import './style.less';

const { Text } = Typography;

interface LichSapToiProps {
	dataCalendar: any[];
	limit?: number;
	onEventClick?: (event: any) => void;
	setExpandMiniCalendar?: (event: any) => void;
}

const LichSapToi: React.FC<LichSapToiProps> = ({ dataCalendar, limit = 5, onEventClick, setExpandMiniCalendar }) => {
	const intl = useIntl();
	const [expandLichSapToi, setExpandLichSapToi] = useState(true);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const contentRef = useRef<HTMLDivElement>(null);

	// Lọc và sắp xếp lịch sắp tới
	const upcomingEvents = dataCalendar
		.filter((event) => dayjs(event.start).isAfter(dayjs()))
		.sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf())
		.slice(0, limit);

	// Update content height when events change
	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, [upcomingEvents]);

	const formatTime = (start: Date, end: Date) => {
		const startMoment = dayjs(start);
		const endMoment = dayjs(end);

		if (startMoment.isSame(endMoment, 'day')) {
			return `${formatDate(start, 'HH:mm')} - ${formatDate(end, 'HH:mm')}`;
		}
		return `${formatDate(start, 'HH:mm')} - ${formatDate(end, 'DD/MM HH:mm')}`;
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
			<div className='lich-sap-toi-header-title card-big-title'>
				{intl.formatMessage({ id: 'lichsukien.lichsaptoi' })}
			</div>

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
		<Card size='small' className='lich-sap-toi-card' title={cardTitle}>
			{upcomingEvents.length === 0 ? (
				<div className={`lich-sap-toi-empty ${expandLichSapToi ? 'expanded' : 'collapsed'}`}>
					<ClockCircleOutlined />
					<div>{intl.formatMessage({ id: 'lichsukien.lichsaptoi.empty' })}</div>
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
												{formatDate(event.start)}
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
