import { EnvironmentOutlined, WarningFilled } from '@ant-design/icons';
import { Card, Flex } from 'antd';
import dayjs from 'dayjs';

const CardCalendar = ({ loading = true }) => {
	const events = [
		{
			time: '8:30',
			type: 'ACTIVITIES',
			title: 'Student Well-being Campaign',
			location: 'National Convention Center, Hanoi City',
			color: 'blue',
		},
		{
			time: '11:20',
			type: 'COURSE',
			title: 'Student Well-being Campaign 1',
			location: 'VinUni_102',
			color: 'orange',
			hasJoin: true,
		},
		{
			time: '11:20',
			type: 'COURSE',
			title: 'Student Well-being Campaign 2',
			location: 'VinUni_102',
			color: 'orange',
			hasJoin: true,
		},
		{
			time: '11:20',
			type: 'EXAM',
			title: 'Master’s Degree Commencement Ceremony Final Exam',
			location: null,
			color: 'purple',
			isWarning: true,
		},
		{
			time: '11:20',
			type: 'EXAM',
			title: 'Master’s Degree Commencement Ceremony Final Exam',
			location: null,
			color: 'purple',
			isWarning: true,
		},
		{
			time: '11:20',
			type: 'EXAM',
			title: 'Master’s Degree Commencement Ceremony Final Exam',
			location: null,
			color: 'purple',
			isWarning: true,
		},
	];

	return (
		<Card
			title={
				<Flex align='center' gap={12}>
					<span className='title'>Calendar</span>
					<span className='date'>{dayjs().format('DD/MM/YYYY')}</span>
				</Flex>
			}
			styles={{
				body: {
					padding: 0,
					position: 'relative',
					minHeight: 460,
				},
			}}
		>
			{loading ? (
				<div className='loading-wrapper'>
					<div className='loading-background loading_calendar'></div>

					<div className='loading-content'>
						{/* <div className='lock-icon-circle'>
							<LockOutlined />
						</div> */}
						<div className='loading-text'>It will be very soon</div>
					</div>
				</div>
			) : (
				<div className='calendar-body'>
					{events.map((event, index) => (
						<div className='event-item' key={index}>
							<div className='event-time'>{event.time}</div>

							<div className='event-timeline'>
								<div className='line'></div>
								<div className={`dot bg-${event.color}`}></div>
							</div>

							<div className='event-content'>
								<div className='event-info'>
									<div className={`event-type text-${event.color}`}>{event.type}</div>
									<div className='event-title'>{event.title}</div>
									{event.location && (
										<div className='event-location'>
											<EnvironmentOutlined className='icon' />
											<span>{event.location}</span>
										</div>
									)}
								</div>

								<div className={`event-actions ${event.hasJoin || event.isWarning ? 'has-action' : ''}`}>
									{event.hasJoin && <button className='join-btn'>Join</button>}
									{event.isWarning && <WarningFilled className='warning-icon' />}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</Card>
	);
};

export default CardCalendar;
