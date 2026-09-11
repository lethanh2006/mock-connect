import { IconStopwatch, Icon2ChervolLeftLine, Icon2ChervolRightLine } from '@/components/Icons';
import { Card, Flex } from 'antd';

const News = ({ loading = true }) => {
	const newsData = [
		{
			id: 1,
			title: 'VinUni Launches the Daesang Food Corner - A Celebration of Student Wellness & Community...',
			date: '21/05/2026',
			image: 'https://placehold.co/120x120/134d8b/white?text=News+Image', // Thay link ảnh thật của bạn vào đây
		},
		{
			id: 2,
			title: 'VinUni Launches the Daesang Food Corner - A Celebration of Student Wellness & Community...',
			date: '21/05/2026',
			image: 'https://placehold.co/120x120/134d8b/white?text=News+Image',
		},
		{
			id: 3,
			title: 'VinUni Launches the Daesang Food Corner - A Celebration of Student Wellness & Community...',
			date: '21/05/2026',
			image: 'https://placehold.co/120x120/134d8b/white?text=News+Image',
		},
		{
			id: 4,
			title: 'VinUni Launches the Daesang Food Corner - A Celebration of Student Wellness & Community...',
			date: '21/05/2026',
			image: 'https://placehold.co/120x120/134d8b/white?text=News+Image',
		},
	];

	return (
		<Card
			className='vin-dashboard-card'
			title={
				<Flex justify='space-between' align='center'>
					<span className='title'>News</span>
					<div className='pagination-controls'>
						<button className='nav-btn'>
							<Icon2ChervolLeftLine />
						</button>
						<button className='nav-btn'>
							<Icon2ChervolRightLine />
						</button>
					</div>
				</Flex>
			}
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
				<div className='news-list'>
					{newsData.map((item) => (
						<div key={item.id} className='news-item'>
							<div className='news-image'>
								<img src={item.image} alt='news' />
							</div>
							<div className='news-content'>
								<h3 className='news-title'>{item.title}</h3>
								<div className='news-date'>
									<IconStopwatch className='date-icon' />
									<span>{item.date}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</Card>
	);
};

export default News;
