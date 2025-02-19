import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Empty } from 'antd';
import { Link } from 'umi';

const CardBaiTapDashboard = () => {
	return (
		<Card
			title='Bài tập sắp tới'
			// loading={loading}
			extra={
				<Link to='/hoc-tap/lop-tin-chi'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			}
		>
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' />
		</Card>
	);
};

export default CardBaiTapDashboard;
