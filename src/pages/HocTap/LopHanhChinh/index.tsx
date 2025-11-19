import { TabViewPage } from '@/components/TabViewPage';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import CardThongBao from '@/pages/ThongBao/ThongBaoLop/CardThongBao';
import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/DienDan';
import { InfoCircleOutlined, MessageOutlined, NotificationOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';
import DienDanLopPage from '../LopHocPhan/DienDan';
import SelectLopHanhChinhSinhVien from './components/Select';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';

const LopHanhChinhPage = () => {
	// const { record: recHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, danhSach, loading, recordDetail } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		if (record?._id) sinhVienGetByIdModel(record._id);
	}, [record?._id]);

	// useEffect(() => {
	// setTabActive(paths[0]);
	// 	// Get lớp hành chính theo kỳ
	// 	if (record?._id && recHocKy?.ma) sinhVienGetByIdModel(record._id, recHocKy?.ma);
	// }, [recHocKy?.ma, record?._id]);

	return (
		<Card
			title='Lớp hành chính'
			variant={'borderless'}
			className='card-big-title card-borderless'
			extra={
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
				/>
			}
		>
			{/* Xem lớp hành chính theo từng học kỳ khác nhau */}
			{/* <FilterHocKy style={{ marginBottom: 8 }} isSetHocKy fromLhc>
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
					maHocKy={recHocKy?.ma}
				/>
			</FilterHocKy>  */}

			<Card variant='borderless'>
				<Spin spinning={loading}>
					{record?._id ? (
						<>
							<TabViewPage
								hideCard
								menu={[
									{
										title: 'Thông tin chung',
										menuKey: 'thong-tin',
										content: (
											<Row gutter={[16, 16]}>
												<Col span={24} md={{ span: 8, push: 16 }} xxl={{ span: 6, push: 18 }}>
													<Row gutter={[16, 16]}>
														<Col span={24}>
															<CardGiangVienLop
																loading={loading}
																title='Cố vấn học tập'
																danhSachNhanSu={
																	recordDetail?.lopHcNsKyList?.map((i) => ({ tenNhanSu: i.hoTenNhanSu, ...i })) ??
																	(recordDetail?.giangVien?.ssoId
																		? [{ nhanSu: recordDetail.giangVien, nhanSuSsoId: recordDetail.giangVien.ssoId }]
																		: [])
																}
																isHighlight
															/>
														</Col>
														<Col span={24}>
															<CardThongBao
																loai='lop-hanh-chinh'
																idLop={record?._id}
																onShowAll={() => (window.location.hash = 'thong-bao')}
															/>
														</Col>
														<Col span={24}>
															<CardDienDanDashboard typeLop={'lop-hanh-chinh'} />
														</Col>
													</Row>
												</Col>
												<Col span={24} md={{ span: 16, pull: 8 }} xxl={{ span: 18, pull: 6 }}>
													<ThongTinChungLopHanhChinh />
												</Col>
											</Row>
										),
										icon: <InfoCircleOutlined />,
									},
									{
										title: 'Thông báo',
										menuKey: 'thong-bao',
										content: <ThongBaoLopPage loai='lop-hanh-chinh' idLop={record._id} />,
										icon: <NotificationOutlined />,
									},
									{
										title: 'Diễn đàn',
										menuKey: 'dien-dan',
										content: <DienDanLopPage idLopHanhChinh={record?._id} />,
										icon: <MessageOutlined />,
									},
								]}
							/>
						</>
					) : (
						<Empty description='Vui lòng chọn lớp hành chính' style={{ margin: '32px 0' }} />
					)}
				</Spin>
			</Card>
		</Card>
	);
};

export default LopHanhChinhPage;
