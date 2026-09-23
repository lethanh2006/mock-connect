import { Card } from '@/components/PageCard';
import { Flex } from 'antd';

type NewsTag = {
	label: string;
	variant: 'info' | 'status';
};

type NewsItem = {
	id: number;
	category: string;
	title: string;
	date: string;
	image: string;
	tag?: NewsTag;
};

const News = ({ loading = true }) => {
	const newsData: NewsItem[] = [
		{
			id: 1,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/134d8b/white?text=News',
		},
		{
			id: 2,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/1d4ed8/white?text=News',
		},
		{
			id: 3,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/0f766e/white?text=News',
		},
		{
			id: 4,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/b91c1c/white?text=News',
			tag: { label: 'Hot', variant: 'status' },
		},
		{
			id: 5,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/134d8b/white?text=News',
			tag: { label: 'Info', variant: 'info' },
		},
		{
			id: 6,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/7c3aed/white?text=News',
			tag: { label: 'Hot', variant: 'status' },
		},
		{
			id: 7,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/c2410c/white?text=News',
			tag: { label: 'Hot', variant: 'status' },
		},
		{
			id: 8,
			category: 'Time',
			title: '20% Off at Campus Bookstore',
			date: 'Jun 1 - Jun 30',
			image: 'https://placehold.co/528x340/0e7490/white?text=News',
			tag: { label: 'Hot', variant: 'status' },
		},
	];

	return (
		<Card
			className='vin-dashboard-card'
			title={
				<Flex justify='space-between' align='center'>
					<h3
						className='title'
						style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', color: 'var(--color-text, inherit)' }}
					>
						Campus News
					</h3>
					{/* <div className='pagination-controls'>
						<Button variant='ghost' size='icon' className='nav-btn' aria-label='Previous news'>
							<Icon2ChervolLeftLine />
						</Button>
						<Button variant='ghost' size='icon' className='nav-btn' aria-label='Next news'>
							<Icon2ChervolRightLine />
						</Button>
					</div> */}
				</Flex>
			}
			styles={{
				body: {
					padding: 0,
					position: 'relative',
					...(loading ? { minHeight: 430 } : {}),
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
						<article key={item.id} className='news-item'>
							<div className='news-image'>
								<img src={item.image} alt={item.title} />
								{item.tag && <span className={`news-tag news-tag--${item.tag.variant}`}>{item.tag.label}</span>}
							</div>
							<div className='news-content'>
								<span className='news-category'>{item.category}</span>
								<h3 className='news-title'>{item.title}</h3>
								<span className='news-date'>{item.date}</span>
							</div>
						</article>
					))}
				</div>
			)}
		</Card>
	);
};

export default News;
