import { TabViewPage } from '@/components/TabViewPage';
import ThongBaoLopPage from '@/pages/ThongBao/ThongBaoLop';
import CardThongBao from '@/pages/ThongBao/ThongBaoLop/CardThongBao';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import CardGiangVienLop from '../LopHocPhan/components/CardGiangVien';
import SelectLopHanhChinhSinhVien from './components/Select';
import ThongTinChungLopHanhChinh from './components/ThongTinChung';
import { InfoCircleOutlined, NotificationOutlined } from '@ant-design/icons';

const mockDanhSach = [
	{ _id: 'lhc-001', ten: 'Lớp Hành chính 101', ma: 'LHC101', khoa: 'CNTT', namHoc: '2024-2025' },
	{ _id: 'lhc-002', ten: 'Lớp Hành chính 102', ma: 'LHC102', khoa: 'Toán', namHoc: '2024-2025' },
];

const mockRecord = mockDanhSach[0];

const mockRecordDetail = {
	_id: mockRecord._id,
	giangVien: { ssoId: 'gv001', hoTen: 'Nguyễn Văn A', email: 'ng.vana@example.com' },
	lopHcNsKyList: [
		{ hoTenNhanSu: 'Nguyễn Văn A', chucVu: 'Cố vấn học tập', nhanSuSsoId: 'gv001' },
		{ hoTenNhanSu: 'Trần Thị B', chucVu: 'Trợ lý lớp', nhanSuSsoId: 'gv002' },
	],
	tenLop: mockRecord.ten,
	maLop: mockRecord.ma,
	soLuongSv: 42,
};

const LopHanhChinhPage = () => {
	// const { record: recHocKy } = useModel('daotao.hocky');
	const { record, sinhVienGetByIdModel, setRecord, danhSach, loading, recordDetail } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		if (record?._id) sinhVienGetByIdModel(record._id);
	}, [record?._id]);

	//fake
	useEffect(() => {
		if (process.env.NODE_ENV === 'development' && !record?._id) {
			// set record mock để Select hiển thị
			if (typeof setRecord === 'function') {
				// mockRecord thiếu một số trường trong IRecord — ép kiểu any cho mục đích dev
				setRecord(mockRecord as any);
			}
			// gọi hàm tải chi tiết nếu model expose function này
			if (typeof sinhVienGetByIdModel === 'function') {
				try {
					sinhVienGetByIdModel(mockRecord._id);
				} catch (e) {
					// nếu hàm cần tham số khác, bỏ qua
				}
			}
			// Ghi thêm mock lên window để debug nếu model không expose setter cho recordDetail
			// eslint-disable-next-line no-undef
			(window as any).__MOCK_LHC_RECORD_DETAIL = mockRecordDetail;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Dùng recordDetail từ model, nếu không có và đang dev thì dùng mockRecordDetail
	const effectiveRecordDetail = recordDetail ?? (process.env.NODE_ENV === 'development' ? mockRecordDetail : undefined);
	//kết thúc fake

	// useEffect(() => {
	// setTabActive(paths[0]);
	// 	// Get lớp hành chính theo kỳ
	// 	if (record?._id && recHocKy?.ma) sinhVienGetByIdModel(record._id, recHocKy?.ma);
	// }, [recHocKy?.ma, record?._id]);

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
							]}
						/>
					</>
				) : (
					<Empty description='Vui lòng chọn lớp hành chính' style={{ margin: '32px 0' }} />
				)}
			</Spin>
		</Card>
	);
};

export default LopHanhChinhPage;
