import { IconBoard, IconRoofedHouse, IconCalendar, IconMobile, IconPlus, IconPeople } from '@/components/Icons';
import { Card } from '@/components/PageCard';
import { history } from 'umi';

const QuickActions = () => {
	const actions = [
		{ id: 1, title: 'Course Section', icon: <IconMobile /> },
		{ id: 2, title: 'Co-Curricular', icon: <IconCalendar /> },
		{ id: 3, title: 'Dormitory', icon: <IconRoofedHouse /> },
		{ id: 4, title: 'Advisory Board', icon: <IconBoard /> },
		{ id: 5, title: 'Club', icon: <IconPeople /> },
	];

	return (
		<Card
			title={<span className='title'>Quick Actions</span>}
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
						<IconPlus />
					</div>
					<span className='action-title'>Add New</span>
				</div>
			</div>
		</Card>
	);
};

export default QuickActions;
