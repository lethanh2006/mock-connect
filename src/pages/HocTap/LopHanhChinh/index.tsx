import { Card, Col, Empty, Row, Tabs } from 'antd';
import { useModel } from 'umi';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';
import SelectLopHanhChinhSinhVien from './components/Select';
import { useEffect } from 'react';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';

const LopHanhChinhPage = () => {
	const { record, sinhVienGetByIdModel, setRecord, danhSach, loading } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		if (record?._id) sinhVienGetByIdModel(record._id);
	}, [record?._id]);

	return (
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title='Lớp hành chính'
			extra={
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
				/>
			}
		>
			{record?._id ? (
				<>
					<Tabs>
						<Tabs.TabPane tab='Thông tin chung' key={0}>
							<Row gutter={[16, 16]}>
								<Col span={24} md={{ span: 8, push: 16 }} xxl={{ span: 6, push: 18 }}>
									<Row gutter={[16, 16]}>
										<Col span={24}>
											<CardGiangVienLop
												loading={loading}
												title='Cố vấn học tập'
												danhSachNhanSu={
													record?.giangVien?._id
														? [{ nhanSu: record.giangVien, nhanSuSsoId: record.giangVien.ssoId }]
														: []
												}
											/>
										</Col>
									</Row>
								</Col>
								<Col span={24} md={{ span: 16, pull: 8 }} xxl={{ span: 18, pull: 6 }}>
									<ThongTinChungLopHanhChinh />
								</Col>
							</Row>
						</Tabs.TabPane>
						<Tabs.TabPane tab='Thông báo' key={1}>
							<ThongBaoLopPage loai='lop-hanh-chinh' idLop={record._id} />
						</Tabs.TabPane>
					</Tabs>
				</>
			) : (
				<Empty description='Vui lòng chọn lớp hành chính' style={{ margin: '32px 0' }} />
			)}
		</Card>
	);
};

export default LopHanhChinhPage;
