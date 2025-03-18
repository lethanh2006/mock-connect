import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Empty } from 'antd';
import { Link } from 'umi';

const CardRenLuyenDashboard = () => {
	return (
		<Card className='dashboard-stat-card'>
			<div className='dashboard-stat-content'>
				<div className='header'>
					<div className='title'>Kết quả rèn luyện</div>
					<Link to='/diem-ren-luyen/phieu-diem-ren-luyen' title='Xem chi tiết'>
						<ArrowRightOutlined />
					</Link>
				</div>

				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
			</div>
		</Card>
	);
};

export default CardRenLuyenDashboard;
