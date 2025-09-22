import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import { TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Row, Tabs } from 'antd';
import { useEffect } from 'react';
import { history, useModel, useParams } from 'umi';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';
import DienDanLopPage from '../LopHocPhan/DienDan';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';

const DetailLopHanhChinh = () => {
	const { record, sinhVienGetByIdModel, loading } = useModel('daotao.lophanhchinh');
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) sinhVienGetByIdModel(id);
	}, [id]);

	return (
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title={
				<Breadcrumb style={{ cursor: 'pointer' }}>
					<Breadcrumb.Item onClick={() => history.push('/lop-hanh-chinh')}>
						<TeamOutlined /> Lớp hành chính
					</Breadcrumb.Item>
					<Breadcrumb.Item>{record?.ten ?? ''}</Breadcrumb.Item>
				</Breadcrumb>
			}
		>
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
											record?.giangVien?._id ? [{ nhanSu: record.giangVien, nhanSuSsoId: record.giangVien.ssoId }] : []
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
					<ThongBaoLopPage loai='lop-hanh-chinh' idLop={id} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Diễn đàn' key={2}>
					<DienDanLopPage idLopHanhChinh={id} />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default DetailLopHanhChinh;
