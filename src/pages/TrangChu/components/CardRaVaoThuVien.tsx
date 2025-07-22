import { Card, Carousel, Col, Empty, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChartVaoRaThuVien from '../../ThuVien/VaoRaThuVien/Dashboard/Chart';
import StatVaoRaThuVien from '../../ThuVien/VaoRaThuVien/Dashboard/Stat';
import '../../ThuVien/VaoRaThuVien/Dashboard/style.less';
import XemTatCaLink from './ViewMore';

const VaoRaThuVienDashboardCard2 = () => {
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		thongKeVaoRaModel();
		thongKeMuonTraSachModel();
	}, []);

	return (
		<Card
			title='Lượt vào thư viện'
			extra={<XemTatCaLink label='Xem thêm' to='/thu-vien/vao-ra' />}
			bodyStyle={{
				padding: 0, // Reset padding bên trong Card
				margin: 0, // AntD không có `margin` trong `bodyStyle` nhưng thêm để chắc chắn
			}}
			loading={loading}
			headStyle={{ border: 'none', backgroundColor: 'transparent', fontSize: 18, margin: 0, padding: '16px 0' }}
			style={{ backgroundColor: 'transparent', border: 'none' }}
		>
			<Card
				style={{
					backgroundColor: '#fff',
					border: 'none',
					margin: 0,
					padding: 0,
					borderRadius: '8px',
					boxShadow: '0px 0px 6px 0px #0000000A',
				}}
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
		</Card>
	);
};

export default VaoRaThuVienDashboardCard2;
