import PageCard from '@/components/PageCard';
import { TabViewPage } from '@/components/TabViewPage';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import CardThongBao from '@/pages/ThongBao/ThongBaoLop/CardThongBao';
import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/DienDan';
import { IconShieldInfo, IconBubbleChat, IconBell } from '@/components/Icons';
import { Col, Empty, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';
import DienDanLopPage from '../LopHocPhan/DienDan';
import SelectLopHanhChinhSinhVien from './components/Select';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';

const LopHanhChinhPage = () => {
	const intl = useIntl();
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
		<PageCard
			title={intl.formatMessage({ id: 'lophanhchinh.title' })}
			bodyStyle={{ padding: 0 }}
			extra={
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
				/>
			}
		>
			<div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
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

				<Spin spinning={loading}>
					{record?._id ? (
						<TabViewPage
							hideCard
							menu={[
								{
									title: intl.formatMessage({ id: 'lophanhchinh.title' }),
									menuKey: 'thong-tin',
									content: (
										<Row gutter={[16, 16]}>
											<Col span={24} order={1} md={{ span: 8, order: 2 }} xxl={{ span: 6, order: 2 }}>
												<Row gutter={[16, 16]}>
													<Col span={24}>
														<CardGiangVienLop
															loading={loading}
															title={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.covanhoctap' })}
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
											<Col span={24} order={2} md={{ span: 16, order: 1 }} xxl={{ span: 18, order: 1 }}>
												<ThongTinChungLopHanhChinh />
											</Col>
										</Row>
									),
									icon: <IconShieldInfo />,
								},
								{
									title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao' }),
									menuKey: 'thong-bao',
									content: <ThongBaoLopPage loai='lop-hanh-chinh' idLop={record._id} />,
									icon: <IconBell />,
								},
								{
									title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.diendan' }),
									menuKey: 'dien-dan',
									content: <DienDanLopPage idLopHanhChinh={record?._id} />,
									icon: <IconBubbleChat />,
								},
							]}
						/>
					) : (
						<Empty
							description={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.empty' })}
							style={{ margin: '32px 0' }}
						/>
					)}
				</Spin>
			</div>
		</PageCard>
	);
};

export default LopHanhChinhPage;
