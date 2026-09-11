import { IconCalendar, IconArrowRight } from '@/components/Icons';
import { Card } from 'antd';

const StudentServices = ({ loading = true }) => {
	const services = [
		{ id: 1, title: 'STUDENT VERIFICATION PROCESS', time: '3-5 work days' },
		{ id: 2, title: 'DOUBLE MAJOR REGISTRATION FORM', time: '3-5 work days' },
		{ id: 3, title: 'LETTER OF RECOMMENDATION', time: '3-5 work days' },
		{ id: 4, title: 'STUDENT DEFERMENT REQUEST FORM', time: '3-5 work days' },
		{ id: 5, title: 'COURSE LIST CERTIFICATE', time: '3-5 work days' },
	];

	return (
		<Card
			title={<span className='title'>Student Services</span>}
			styles={{
				body: {
					padding: 0,
					position: 'relative',
					minHeight: 430,
				},
			}}
		>
			{loading ? (
				<div className='loading-wrapper'>
					<div className='loading-background loading_new'></div>

					<div className='loading-content'>
						{/* <div className='lock-icon-circle'>
							<LockOutlined />
						</div> */}
						<div className='loading-text'>It will be very soon</div>
					</div>
				</div>
			) : (
				<div className='services-list'>
					{services.map((service) => (
						<div key={service.id} className='service-item'>
							<div className='service-info'>
								<h3 className='service-name'>{service.title}</h3>
								<div className='service-meta'>
									<IconCalendar className='icon-calendar' />
									<span>{service.time}</span>
								</div>
							</div>
							<button className='btn-action'>
								<IconArrowRight />
							</button>
						</div>
					))}
				</div>
			)}
		</Card>
	);
};

export default StudentServices;
