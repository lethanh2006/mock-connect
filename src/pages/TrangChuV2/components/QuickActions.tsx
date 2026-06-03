import {
	ApartmentOutlined,
	BankOutlined,
	CalendarOutlined,
	DesktopOutlined,
	PlusOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import { history } from 'umi';

const QuickActions = () => {
	const actions = [
		{ id: 1, title: 'Course Section', icon: <DesktopOutlined /> },
		{ id: 2, title: 'Co-Curricular', icon: <CalendarOutlined /> },
		{ id: 3, title: 'Dormitory', icon: <BankOutlined /> },
		{ id: 4, title: 'Advisory Board', icon: <ApartmentOutlined /> },
		{ id: 5, title: 'Club', icon: <TeamOutlined /> },
	];

	return (
		<Card
			title={<span className='title'>Quick Actions</span>}
			styles={{
				body: {
					padding: 0,
				},
			}}
		>
			<div className='actions-grid'>
				{actions.map((item) => (
					<div
						key={item.id}
						className='action-item'
						onClick={() => {
							if (item?.id === 2) {
								history.push('/experience-porfolio/activity-logging');
							}
						}}
					>
						<div className='icon-wrapper'>{item.icon}</div>
						<span className='action-title'>{item.title}</span>
					</div>
				))}

				<div className='action-item add-new'>
					<div className='icon-wrapper'>
						<PlusOutlined />
					</div>
					<span className='action-title'>Add New</span>
				</div>
			</div>
		</Card>
	);
};

export default QuickActions;
