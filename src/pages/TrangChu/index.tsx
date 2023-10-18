import { Col, Row } from 'antd';
import LichDashboard from '../Calendar/LichDashboard';
import TinTucDashboard from '../TinTucWP/TinTucDashboard';
import CardLopHocPhan from './components/CardLopHocPhan';
import CardTienTrinhTotNghiep from './components/CardTienTrinhTotNghiep';

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
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardLopHocPhan />
						</Col>
						<Col span={24}>
							<TinTucDashboard />
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
};

export default TrangChu;
