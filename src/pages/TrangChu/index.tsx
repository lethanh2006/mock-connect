import CalendarPage from '@/pages/Calendar';
import { Col, Row, Card, Tabs, Statistic } from 'antd';
import TinTucDashboard from '../TinTucStrapi/TinTucDashboard';
import BlockSinhVien from './components/BlockSinhVien';

const TrangChu = () => {
	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={16}>
					<Row gutter={[16, 16]} style={{ height: '100%' }}>
						<Col span={24} md={8}>
							<Card>
								<Statistic title='GPA' value={3.2} />
							</Card>
						</Col>
						<Col span={24} md={8}>
							<Card>asdad</Card>
						</Col>
						<Col span={24} md={8}>
							<Card>asdad</Card>
						</Col>

						{/* <Col span={24}>
							<Card title='Lịch sắp tới'>Lịch sắp tới</Card>
						</Col> */}
						<Col xs={24}>
							<CalendarPage isDashboard />
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Card title='Lớp học phần'>sadfsd</Card>
						</Col>
						<Col span={24}>
							<Card bodyStyle={{ paddingTop: 8 }}>
								<Tabs>
									<Tabs.TabPane key='1' tab={<span style={{ fontSize: 16 }}>Tin tức</span>} />
									<Tabs.TabPane key='2' tab={<span style={{ fontSize: 16 }}>Thông báo</span>} />
								</Tabs>
								asdas
							</Card>
						</Col>
					</Row>
				</Col>
				{/* <BlockSinhVien /> */}

				{/* <Col xs={24} lg={10} xl={8}>
					<TinTucDashboard />
				</Col> */}
			</Row>
		</>
	);
};

export default TrangChu;
