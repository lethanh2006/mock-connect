import { Card, Flex } from 'antd';

const ToDoList = ({ loading = true }) => {
	const todoData = [
		{
			id: 1,
			category: 'FINANCE',
			title: 'Fall 2026 Tuition Payment Period 1',
			status: 'urgent',
			extraInfo: {
				label: 'Remaining: 01:12:05',
				value: '121.500.000đ',
			},
			buttonText: 'Pay',
			buttonType: 'primary-red',
		},
		{
			id: 2,
			category: 'ACTIVITIES',
			title: 'Register for the VINUNI CAREER DAY 2025 Event',
			status: 'due-soon',
			extraInfo: {
				label: 'Due: 13/05/2026',
				value: 'National Conventio...',
			},
			buttonText: 'Join',
			buttonType: 'default',
		},
		{
			id: 3,
			category: 'SERVICE',
			title: 'Student Verification Process Revision Request',
			status: 'due-soon',
			extraInfo: {
				label: 'Due: 13/05/2026',
			},
			buttonText: 'Join',
			buttonType: 'default',
		},
		{
			id: 4,
			category: 'SERVICE',
			title: 'Student Verification Process Revision Request',
			status: 'due-soon',
			extraInfo: {
				label: 'Due: 13/05/2026',
			},
			buttonText: 'Join',
			buttonType: 'default',
		},
		{
			id: 5,
			category: 'SERVICE',
			title: 'Student Verification Process Revision Request',
			status: 'due-soon',
			extraInfo: {
				label: 'Due: 13/05/2026',
			},
			buttonText: 'Join',
			buttonType: 'default',
		},
		{
			id: 6,
			category: 'SERVICE',
			title: 'Student Verification Process Revision Request',
			status: 'due-soon',
			extraInfo: {
				label: 'Due: 13/05/2026',
			},
			buttonText: 'Join',
			buttonType: 'default',
		},
	];

	return (
		<Card
			title={
				<Flex align='center' gap={12}>
					<span className='title'>Today's to-do list</span>
					<span className='date'>{loading ? `--` : 3} Todo</span>
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
			<div className='todolist-body'>
				{loading ? (
					<div className='loading-wrapper'>
						<div className='loading-background loading_todo'></div>

						<div className='loading-content'>
							{/* <div className='lock-icon-circle'>
								<LockOutlined />
							</div> */}
							<div className='loading-text'>It will be very soon</div>
						</div>
					</div>
				) : (
					<>
						<div className='todo-summary'>
							<div className='summary-item'>
								<span className='dot urgent'></span> 1 Urgents
							</div>
							<div className='summary-item'>
								<span className='dot due-soon'></span> 2 Due Soon
							</div>
						</div>
						<div className='todo-list'>
							{todoData.map((item) => (
								<div key={item.id} className={`todo-item ${item.status}`}>
									<div className='item-content'>
										<span className='category'>{item.category}</span>
										<h3 className='item-title'>{item.title}</h3>
										<div className='item-footer'>
											<span className='info-label'>{item.extraInfo.label}</span>
											{item.extraInfo.value && (
												<>
													<span className='separator'>•</span>
													<span className='info-value'>{item.extraInfo.value}</span>
												</>
											)}
										</div>
									</div>
									<button className={`action-btn ${item.buttonType}`}>{item.buttonText}</button>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</Card>
	);
};

export default ToDoList;
