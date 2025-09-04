import { Card, Carousel, Empty } from 'antd';
import { useEffect } from 'react';
import { Link, useModel } from 'umi';
import ChartVaoRaThuVien from './Chart';
import StatVaoRaThuVien from './Stat';
import './style.less';

const VaoRaThuVienDashboardCard = () => {
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');

	useEffect(() => {
		thongKeVaoRaModel();
	}, []);

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title='Lượt vào thư viện'
			extra={
				<Link to={'/thu-vien/vao-ra'} type='link' className='xem-tat-ca-link'>
					Xem thêm
				</Link>
			}
			loading={loading}
		>
			<Card variant='borderless' style={{ borderRadius: 8 }}>
				{thongKeVaoRa.length ? (
					<Carousel autoplay pauseOnDotsHover autoplaySpeed={2500} infinite>
						<div>
							<StatVaoRaThuVien />
						</div>
						<div>
							<ChartVaoRaThuVien />
						</div>
					</Carousel>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} description='Không có dữ liệu' />
				)}
			</Card>
		</Card>
	);
};

export default VaoRaThuVienDashboardCard;
