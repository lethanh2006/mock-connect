import { Col, Row } from 'antd';
import ThongKeCCT from '../CCT/ThongKe';
import './components/style.less';
import WelcomeCard from './components/XinChao';

const TrangChu = () => {
	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={24}>
						<WelcomeCard />
					</Col>
					{/* <Col span={24} md={6}>
						<CardThongBaoDashboard />
					</Col>
					<Col span={24} md={6}>
						<CardSuKienSapToi />
					</Col> */}
				</Row>
			</Col>

			<Col span={24}>
				<ThongKeCCT />
			</Col>

			{/* <Col span={24}>
				<CardLopHocPhan />
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={16} lg={16} xl={18}>
						<CardBaiTapDashboard isDashBoard />
					</Col>
					<Col xs={24} sm={12} md={8} lg={8} xl={6}>
						<LichDashboard />
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={16} lg={18} xl={18}>
						<CardHocTapRenLuyenDashboard />
					</Col>

					<Col xs={24} sm={12} md={8} lg={6} xl={6}>
						<CardDichVuSinhVien />
					</Col>
				</Row>
			</Col> */}

			<Col span={24}>
				<Row className='diendan-thuvien-banner' gutter={[16, 16]}>
					<Col span={24} md={12}>
						<Row gutter={[16, 16]}>
							{/* <Col span={24} className='nq57-ptit'>
							<img
								src='/images/nq57-ptit.png'
								alt='Tuổi trẻ PTIT với Nghị quyết 57'
								title='Tuổi trẻ PTIT với Nghị quyết 57'
								onClick={() => {}}
							/>
						</Col> */}

							{/* <Col className='card-diendan' span={24}>
								<CardDienDanDashboard typeLop='all' />
							</Col> */}
						</Row>
					</Col>

					<Col span={24} md={12}>
						<Row gutter={[16, 16]}>
							{/* <Col span={24}>
							<CardCuocThiDashboard />
						</Col> */}
							<Col span={24}>{/* <VaoRaThuVienDashboardCard /> */}</Col>
							<Col span={24}>
								{/* <ChatbotBanner /> */}
								{/* <ThongKeMuonSachCard /> */}
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>

			<Col span={24} className='tintuc-dashboard'>
				{/* <TinTucDashboardWrapper /> */}
			</Col>
		</Row>
	);
};

export default TrangChu;
