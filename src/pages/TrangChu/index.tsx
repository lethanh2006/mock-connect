import { Col, Row } from 'antd';
import LichDashboard from '../Calendar/LichDashboard';
import TinTucDashboardWrapper from '../TinTuc/Wrapper/Dashboard';
import CardLopHocPhan from './components/CardLopHocPhan';
import CardTienTrinhTotNghiep from './components/CardTienTrinhTotNghiep';
import './components/style.less';
import CalendarPage from '../Calendar';

const TrangChu = () => {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={16}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardTienTrinhTotNghiep />
						</Col>

						<Col xs={24}>
							<LichDashboard />
							{/* <CalendarPage isDashboard /> */}
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardLopHocPhan />
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
