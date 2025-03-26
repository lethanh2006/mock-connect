import { Col, Row } from 'antd';
import LichDashboard from '../Calendar/LichDashboard';
import TinTucDashboardWrapper from '../TinTuc/Wrapper/Dashboard';
import CardCongNoDashboard from './components/CardCongNo';
import './components/style.less';
import CardHocTapRenLuyenDashboard from './HocTapRenLuyen';
import CardBaiTapDashboard from './HocTapRenLuyen/CardBaiTap';
import CardCuocThiDashboard from './HocTapRenLuyen/CardCuocThi';
import CardDienDanDashboard from './HocTapRenLuyen/CardDienDan';
import CardLopHocPhan from './HocTapRenLuyen/CardLopHocPhan';

const TrangChu = () => {
	return (
		<>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={24} md={16}>
					<CardHocTapRenLuyenDashboard />
				</Col>

				<Col span={24} md={8}>
					<CardCongNoDashboard />
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col span={24} md={16}>
					<Row gutter={[16, 16]}>
						{/* <Col span={24}>
							<CardTienTrinhTotNghiep />
						</Col> */}

						<Col xs={24}>
							<LichDashboard />
						</Col>

						<Col span={24} md={12}>
							<CardDienDanDashboard />
						</Col>
						<Col span={24} md={12}>
							<CardBaiTapDashboard />
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardLopHocPhan />
						</Col>
						<Col span={24}>
							<CardCuocThiDashboard />
						</Col>
						<Col span={24}>
							<TinTucDashboardWrapper />
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
};

export default TrangChu;
