import { Col, Row } from 'antd';

import VaoRaThuVienDashboardCard from '../ThuVien/VaoRaThuVien/Dashboard/Card';
import CardDichVuSinhVien from './components/DichVu';
import LichDashboard from './components/Lich';
import CardSuKienSapToi from './components/SuKienSapToi';
import CardThongBaoDashboard from './components/ThongBao';
import TinTucDashboardWrapper from './components/TinTuc/TinTucDashboardWrapper';
import WelcomeCard from './components/XinChao';
import CardHocTapRenLuyenDashboard from './HocTapRenLuyen';
import CardBaiTapDashboard from './HocTapRenLuyen/BaiTap';
import CardDienDanDashboard from './HocTapRenLuyen/CardDienDan';
import CardLopHocPhan from './HocTapRenLuyen/CardLopHocPhan';
import './styles.less';

const TrangChu = () => {
	return (
		<div className='trang-chu'>
			<Row className='xinchao-thongbao-sukien' gutter={[16, 16]} style={{ margin: ' 0 4px' }}>
				<Col span={24} md={12} style={{ height: '100%' }}>
					<WelcomeCard />
				</Col>

				<Col span={24} md={12} style={{ height: '100%' }}>
					<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
						<Col span={24} md={12} style={{ height: '100%' }}>
							<CardThongBaoDashboard />
						</Col>
						<Col span={24} md={12} style={{ height: '100%' }}>
							<CardSuKienSapToi />
						</Col>
					</Row>
				</Col>
			</Row>

			<Row className='card-loptinchi' gutter={[0, 0]}>
				<Col span={24} md={24} style={{ height: '100%' }}>
					<CardLopHocPhan />
				</Col>
			</Row>

			<Row className='card-baitap-and-lich' gutter={[0, 0]} style={{ margin: '0 10px', marginBottom: 24 }}>
				<Col span={24}>
					<Row gutter={[0, 0]}>
						<Col span={24} md={18}>
							<CardBaiTapDashboard />
						</Col>
						<Col xs={24} md={6} className='card-lich'>
							<LichDashboard />
						</Col>
					</Row>
				</Col>
			</Row>

			<Row className='card-thongkedulieu' gutter={[0, 0]} style={{ marginBottom: 16 }}>
				<Col span={24} md={18} style={{ height: '100%' }}>
					<CardHocTapRenLuyenDashboard />
				</Col>

				<Col span={24} md={6} style={{ height: '100%' }}>
					<CardDichVuSinhVien />
				</Col>
			</Row>

			<Row className='diendan-thuvien-banner' gutter={[16, 16]} style={{ margin: '0 4px 24px' }}>
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

						<Col className='card-diendan' span={24}>
							<CardDienDanDashboard />
						</Col>
					</Row>
				</Col>

				<Col span={24} md={12}>
					<Row gutter={[16, 16]}>
						{/* <Col span={24}>
							<CardCuocThiDashboard />
						</Col> */}
						<Col span={24}>
							<VaoRaThuVienDashboardCard />
						</Col>
						<Col span={24}>{/* <ChatbotBanner /> */}</Col>
					</Row>
				</Col>
			</Row>

			<Row className='tintuc-dashboard' style={{ marginTop: 16 }}>
				<Col span={24}>
					<TinTucDashboardWrapper />
				</Col>
			</Row>
		</div>
	);
};

export default TrangChu;
