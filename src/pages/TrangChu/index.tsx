import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import CalendarPage from '@/pages/Calendar';
import { Card, Col, Modal, Row, Statistic, Tabs } from 'antd';
import { useModel } from 'umi';
import ViewThongBao from '../ThongBao/components/ViewThongBao';
import TinTucDashboard from '../TinTucWP/TinTucDashboard';
import CardLopHocPhan from './components/CardLopHocPhan';
import { useEffect, useState } from 'react';
import Progress from 'antd/es/progress';

const TrangChu = () => {
	const { danhSach, record, setRecord } = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);
	const {
		getTienTrinhChungChiCTDTModel,
		record: recTienTrinh,
		dieuKienTotNghiep,
	} = useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		getTienTrinhChungChiCTDTModel();
	}, []);

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={16}>
					<Row gutter={[16, 16]}>
						<Col span={24} md={8}>
							<Card>
								<Statistic
									valueStyle={{
										color: `${dieuKienTotNghiep?.isDuDieuKienTBC ? '#52c41a' : '#ff4d4f'}`,
										fontWeight: 'bold',
									}}
									title='GPA'
									value={recTienTrinh?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0}
									suffix='/4'
								/>
							</Card>
						</Col>
						<Col span={24} md={8}>
							<Card>
								<Statistic
									valueStyle={{ fontSize: '18px' }}
									title='Tín chỉ tích lũy'
									value={recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0}
									suffix={`/${recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? 0}`}
									prefix={<Progress width={50} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />}
								/>
							</Card>
						</Col>
						<Col span={24} md={8}>
							<Card>
								<Statistic title='Công nợ' value={0} />
							</Card>
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
