import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import { Card, Col, Modal, Row, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewThongBao from '../ThongBao/components/ViewThongBao';
import TinTucDashboard from '../TinTucWP/TinTucDashboard';
import CardLopHocPhan from './components/CardLopHocPhan';
import CardTienTrinhTotNghiep from './components/CardTienTrinhTotNghiep';
import { LichTrongTuan } from './components/LichTrongTuan';

const TrangChu = () => {
	const { danhSach, record, setRecord } = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={16}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardTienTrinhTotNghiep />
						</Col>

						{/* <Col span={24}>
							<Card title='Lịch sắp tới'>Lịch sắp tới</Card>
						</Col> */}
						<Col xs={24}>
							<LichTrongTuan />
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<CardLopHocPhan />
						</Col>
						<Col span={24}>
							<Card bodyStyle={{ paddingTop: 8 }}>
								<Tabs>
									<Tabs.TabPane key='1' tab={<span style={{ fontSize: 16 }}>Tin tức</span>}>
										<TinTucDashboard hiddenTitle />
									</Tabs.TabPane>
									<Tabs.TabPane key='2' tab={<span style={{ fontSize: 16 }}>Thông báo</span>}>
										<NoticeList
											onClick={(item) => (setRecord(item), setVisibleThongBao(true))}
											title={''}
											tabKey={''}
											list={danhSach}
										/>
									</Tabs.TabPane>
								</Tabs>
							</Card>
						</Col>
					</Row>
				</Col>
				{/* <BlockSinhVien /> */}

				{/* <Col xs={24} lg={10} xl={8}>
					<TinTucDashboard />
				</Col> */}
				<Modal
					width={800}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
					onCancel={() => setVisibleThongBao(false)}
					visible={visibleThongBao}
					okButtonProps={{ hidden: true }}
					cancelText='Đóng'
				>
					<ViewThongBao record={record} />
				</Modal>
			</Row>
		</>
	);
};

export default TrangChu;
