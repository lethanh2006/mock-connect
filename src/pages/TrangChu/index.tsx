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
import CardLopHocPhan from './HocTapRenLuyen/CardLopHocPhan';
import CardDienDanDashboard from './HocTapRenLuyen/DienDan';
import './styles.less';

const TrangChu = () => {
	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={12}>
						<WelcomeCard />
					</Col>
					<Col span={24} md={6}>
						<CardThongBaoDashboard />
					</Col>
					<Col span={24} md={6}>
						<CardSuKienSapToi />
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<CardLopHocPhan />
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={18}>
						<CardBaiTapDashboard />
					</Col>
					<Col span={24} md={6}>
						<LichDashboard />
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={18}>
						<CardHocTapRenLuyenDashboard />
					</Col>

					<Col span={24} md={6}>
						<CardDichVuSinhVien />
					</Col>
				</Row>
			</Col>

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
			</Col>

			<Col span={24} className='tintuc-dashboard'>
				<TinTucDashboardWrapper />
			</Col>
		</Row>
	);
};

export default TrangChu;
