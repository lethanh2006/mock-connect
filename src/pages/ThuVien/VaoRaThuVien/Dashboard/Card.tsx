import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Carousel, Col, Empty, Row } from 'antd';
import { useEffect } from 'react';
import { Link, useModel } from 'umi';
import ChartVaoRaThuVien from './Chart';
import StatVaoRaThuVien from './Stat';
import './style.less';

const VaoRaThuVienDashboardCard = () => {
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		thongKeVaoRaModel();
		thongKeMuonTraSachModel();
	}, []);

	return (
		<Card
			title='Lượt vào thư viện'
			extra={
				<Link to={'/thu-vien/vao-ra'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
					Xem thêm <ArrowRightOutlined />
				</Link>
			}
			bodyStyle={{ paddingBottom: 5 }}
			loading={loading}
		>
			{thongKeVaoRa.length ? (
				<Carousel autoplay pauseOnDotsHover>
					<div>
						<StatVaoRaThuVien />
					</div>
					<div>
						<ChartVaoRaThuVien />
					</div>
					<div>
						<Row gutter={[12, 12]}>
							<Col span={24} md={12}>
								<Card className='card-stat-small'>
									<span className='num' style={{ color: 'blue' }}>
										{dataThongKe?.choXuLy ?? 0}
									</span>
									<span>Chờ xử lý</span>
								</Card>
							</Col>
							<Col span={24} md={12}>
								<Card className='card-stat-small'>
									<span className='num' style={{ color: 'orange' }}>
										{dataThongKe?.dangThueMuon}
									</span>
									<span>Đang mượn</span>
								</Card>
							</Col>
						</Row>
					</div>
					<div>
						<Row gutter={[12, 12]}>
							<Col span={24} md={12}>
								<Card className='card-stat-small'>
									<span className='num' style={{ color: 'rec' }}>
										{dataThongKe?.quaHan}
									</span>
									<span>Quá hạn mượn</span>
								</Card>
							</Col>
							<Col span={24} md={12}>
								<Card className='card-stat-small'>
									<span className='num' style={{ color: 'green' }}>
										{dataThongKe?.daTra}
									</span>
									<span>Đã trả</span>
								</Card>
							</Col>
						</Row>
					</div>
				</Carousel>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} description='Không có dữ liệu' />
			)}
		</Card>
	);
};

export default VaoRaThuVienDashboardCard;
