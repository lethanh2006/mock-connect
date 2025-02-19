import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Empty } from 'antd';
import { Link } from 'umi';

const CardDienDanDashboard = () => {
	return (
		<Card
			title='Diễn đàn thảo luận'
			// loading={loading}
			extra={
				<Link to='/hoc-tap/lop-tin-chi'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			}
		>
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có diễn đàn' />
		</Card>
	);
};

export default CardDienDanDashboard;
