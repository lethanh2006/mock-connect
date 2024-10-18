import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import CardThongBao from '@/pages/ThongBao/ThongBaoLop/CardThongBao';
import { Card, Col, Empty, Row, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';
import SelectLopHanhChinhSinhVien from './components/Select';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';

const LopHanhChinhPage = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, danhSach, loading, recordDetail } = useModel('daotao.lophanhchinh');
	const paths = ['thong-tin', 'thong-bao'];
	const [tabActive, setTabActive] = useState<string>(paths[0]);

	useEffect(() => {
		if (record?._id) sinhVienGetByIdModel(record._id);
	}, [record?._id]);

	// useEffect(() => {
	// 	// Get lớp hành chính theo kỳ
	// 	if (record?._id && recHocKy?.ma) sinhVienGetByIdModel(record._id, recHocKy?.ma);
	// }, [recHocKy?.ma, record?._id]);

	const onChangeTab = (tab: string) => {
		setTabActive(tab);
	};

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
			{/* Xem lớp hành chính theo từng học kỳ khác nhau */}
			{/* <FilterHocKy style={{ marginBottom: 8 }} isSetHocKy fromLhc onChange={() => setRecord(undefined)}>
				<SelectLopHanhChinhSinhVien
					value={record?._id}
					onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
					style={{ width: 180 }}
					hasDefault
					maHocKy={recHocKy?.ma}
				/>
			</FilterHocKy> */}

			<Spin spinning={loading}>
				{record?._id ? (
					<>
						<Tabs onChange={onChangeTab} activeKey={tabActive}>
							<Tabs.TabPane tab='Thông tin chung' key={paths[0]}>
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
													onShowAll={() => onChangeTab(paths[1])}
												/>
											</Col>
										</Row>
									</Col>
									<Col span={24} md={{ span: 16, pull: 8 }} xxl={{ span: 18, pull: 6 }}>
										<ThongTinChungLopHanhChinh />
									</Col>
								</Row>
							</Tabs.TabPane>
							<Tabs.TabPane tab='Thông báo' key={paths[1]}>
								<ThongBaoLopPage loai='lop-hanh-chinh' idLop={record._id} />
							</Tabs.TabPane>
						</Tabs>
					</>
				) : (
					<Empty description='Vui lòng chọn lớp hành chính' style={{ margin: '32px 0' }} />
				)}
			</Spin>
		</Card>
	);
};

export default LopHanhChinhPage;
