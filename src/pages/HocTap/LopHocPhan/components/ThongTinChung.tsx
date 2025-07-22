import ButtonExtend from '@/components/Table/ButtonExtend';
import ThongTinChungPage from '@/pages/DaoTao/DeCuongHocPhan/components/ThongTinChung';
import HocLieuDeCuongPage from '@/pages/DaoTao/DeCuongHocPhan/HocLieuDeCuong';
import NoiDungHocPhanPage from '@/pages/DaoTao/DeCuongHocPhan/LichTrinhChung';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';

import CardThongBao from '@/pages/ThongBao/ThongBaoLop/CardThongBao';
import {
	AimOutlined,
	BookOutlined,
	DesktopOutlined,
	DownloadOutlined,
	FileTextOutlined,
	GlobalOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Empty, message, Modal, Row, Space, Spin, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

import CardBaiTapLopHp from './CardBaiTapLopHp';
import GioiThieuChungLopHp from './GioiThieuChung';

const { Text } = Typography;

interface GiangVien {
	hoTen: string;
	emailCanBo: string;
	ngaySinh: string;
	gioiTinh: string;
	hocHam?: string;
	trinhDoDaoTao?: string;
	donViViTri?: {
		tenChucVu?: string;
	};
	donViChinh?: {
		ten?: string;
	};
}

const ThongTinChung = () => {
	const { loading, record, getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
	const { danhSach: danhSachHocLieu, loading: loadingHocLieu, getAllModel } = useModel('hocphan.hoclieudecuong');
	const { danhSach: danhSachNoiDungHocPhan } = useModel('hocphan.noidunghp');
	const {
		record: recLopThucHanh,
		danhSach: danhSachLopThucHanh,
		sinhVienGetByIdModel: getByIdLopThucHanh,
		sinhVienGetModel: getLopThucHanh,
		danhSachNhanSu: danhSachNhanSuLopTH,
		getAllNhanSuModel: getNhanSuLopTH,
		loading: loadingThucHanh,
	} = useModel('daotao.lopthuchanh');
	const [activeKey, setActiveKey] = useState<string>('-1');
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleHocLieu, setVisibleHocLieu] = useState<boolean>(false);
	const [visibleKyNang, setVisibleKyNang] = useState<boolean>(false);
	const [activeKyNangTab, setActiveKyNangTab] = useState<string>('content');

	// Lấy dữ liệu kỹ năng từ nhiều nguồn
	const kyNangDatDuoc = recDeCuong?.kyNangDatDuoc || recDeCuong?.ketQuaDatDuoc || [];
	const mucTieuHocPhan = recDeCuong?.mucTieuHocPhan || '';
	const chuanDauRa = recDeCuong?.chuanDauRa || '';

	// Hiển thị 3 kỹ năng đầu tiên trong card
	const displayKyNang = kyNangDatDuoc.slice(0, 3);

	// Tính toán tổng số giờ học từ nội dung học phần
	const totalHours =
		danhSachNoiDungHocPhan?.reduce((total, item) => {
			return total + (item.gioLyThuyet || 0) + (item.gioBaiTapTL || 0) + (item.gioThucHanh || 0) + (item.gioTuHoc || 0);
		}, 0) || 0;

	useEffect(() => {
		setActiveKey('-1');
		if (record?._id) {
			getLopThucHanh({ tenCha: record?.ten });
		}
		getAllModel();
	}, [record?._id]);

	useEffect(() => {
		if (activeKey !== '-1') {
			getByIdLopThucHanh(activeKey);
			getNhanSuLopTH(activeKey);
		}
	}, [activeKey]);

	const handleMoodle = () => {
		if (record?.moodleShortname && record?._id)
			getMoodleLopHocPhanModel(record._id).then((data) => {
				if (data?.url) window.open(`${data.url}`);
				else message.error('Có lỗi, vui lòng thử lại sau');
			});
	};

	let allThoiKhoaBieu = record?.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(record?.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []);
	const past = allThoiKhoaBieu.filter((i) => moment().isAfter(i?.ngay)).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || record?.diem?.diemHpSvHk?.diemKthp;
	const [selectedGiangVien, setSelectedGiangVien] = useState<GiangVien | null>(null);
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);

	// Lấy dữ liệu học liệu thực tế (giới hạn 3 item đầu tiên để hiển thị)
	const displayHocLieu = (danhSachHocLieu || []).slice(0, 3);

	// Render kỹ năng item với thiết kế cải tiến
	const renderKyNangItem = (item: any, index: number, isPreview: boolean = false) => (
		<div
			key={index}
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				padding: isPreview ? '12px 0' : '16px 0',
				borderBottom: index < displayKyNang.length - 1 ? '1px solid #f0f0f0' : 'none',
				borderRadius: isPreview ? '8px' : '0px',
				backgroundColor: isPreview ? '#fafafa' : 'transparent',
				marginBottom: isPreview ? '0' : '8px',
			}}
		>
			<div
				style={{
					minWidth: '32px',
					height: '32px',
					backgroundColor: '#1677ff',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginRight: 16,
					marginTop: 2,
					boxShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
				}}
			>
				<Text style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{index + 1}</Text>
			</div>
			<div style={{ flex: 1 }}>
				<div
					style={{
						fontWeight: 600,
						fontSize: '15px',
						marginBottom: 6,
						color: '#262626',
						lineHeight: '1.4',
					}}
				>
					{item.tieuDe || item.ten || item.kyNang || 'Không có tiêu đề'}
				</div>
				{item.moTa && (
					<div
						style={{
							color: '#595959',
							fontSize: '14px',
							lineHeight: '1.6',
							marginBottom: 8,
						}}
					>
						{isPreview && item.moTa.length > 120 ? `${item.moTa.substring(0, 120)}...` : item.moTa}
					</div>
				)}
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
					{item.mucDo && (
						<Tag
							color={item.mucDo === 'Cao' ? 'red' : item.mucDo === 'Trung bình' ? 'orange' : 'green'}
							style={{
								borderRadius: '4px',
								fontWeight: 500,
								fontSize: '12px',
							}}
						>
							Mức độ: {item.mucDo}
						</Tag>
					)}
					{item.loaiKyNang && (
						<Tag
							color='blue'
							style={{
								borderRadius: '4px',
								fontWeight: 500,
								fontSize: '12px',
							}}
						>
							{item.loaiKyNang}
						</Tag>
					)}
					{item.thoiGianHoc && (
						<Tag
							color='purple'
							style={{
								borderRadius: '4px',
								fontWeight: 500,
								fontSize: '12px',
							}}
						>
							{item.thoiGianHoc}h
						</Tag>
					)}
				</div>
			</div>
		</div>
	);

	// Render modal với TabPane
	const renderKyNangModal = () => (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<AimOutlined style={{ color: '#1677ff' }} />
					<span>Kỹ năng & Nội dung học phần</span>
				</div>
			}
			open={visibleKyNang}
			onCancel={() => setVisibleKyNang(false)}
			footer={null}
			width={1200}
			style={{ top: 20 }}
		>
			<Tabs activeKey={activeKyNangTab} onChange={setActiveKyNangTab} size='large' style={{ minHeight: '500px' }}>
				<Tabs.TabPane
					tab={
						<span>
							<BookOutlined />
							Nội dung học phần
						</span>
					}
					key='content'
				>
					<div style={{ padding: '16px 0' }}>
						<NoiDungHocPhanPage />
					</div>
				</Tabs.TabPane>

				<Tabs.TabPane
					tab={
						<span>
							<AimOutlined />
							Kỹ năng đạt được ({kyNangDatDuoc.length})
						</span>
					}
					key='skills'
				>
					<div style={{ padding: '16px 0' }}>
						{kyNangDatDuoc.length > 0 ? (
							<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
								{kyNangDatDuoc.map((item: any, index: number) => renderKyNangItem(item, index, false))}
							</div>
						) : (
							<div
								style={{
									textAlign: 'center',
									color: '#999',
									padding: '60px 0',
									fontSize: '16px',
								}}
							>
								<AimOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
								<div>Chưa có thông tin kỹ năng đạt được</div>
							</div>
						)}
					</div>
				</Tabs.TabPane>

				<Tabs.TabPane
					tab={
						<span>
							<FileTextOutlined />
							Thông tin chung
						</span>
					}
					key='general'
				>
					<div style={{ padding: '16px 0' }}>
						<ThongTinChungPage />
					</div>
				</Tabs.TabPane>
			</Tabs>
		</Modal>
	);

	return (
		<Spin spinning={loading}>
			<div
				style={{
					backgroundColor: 'white',
					padding: '16px 16px 0px 16px',
					margin: '0px 0 -16px 0',
					borderRadius: '8px',
				}}
			>
				<div
					style={{
						borderBottom: '1px dashed transparent',
						borderImage: 'repeating-linear-gradient(to right, #ccc 0 8px, transparent 8px 16px)',
						borderImageSlice: 1,
						marginBottom: '16px',
					}}
				>
					<GioiThieuChungLopHp />
				</div>
				<div
					style={{
						borderBottom: '1px dashed transparent',
						borderImage: 'repeating-linear-gradient(to right, #ccc 0 8px, transparent 8px 16px)',
						borderImageSlice: 1,
						marginBottom: '16px',
						paddingBottom: '16px',
					}}
				>
					<Row
						gutter={[16, 16]}
						style={{
							padding: '8px 0',
						}}
					>
						{/* Mã học phần */}
						<Col xs={24} sm={12} md={6}>
							<Text style={{ color: '#888' }}>Mã học phần:</Text>
							<div>
								<Text strong style={{ color: '#1677ff' }}>
									{record?.hocPhan?.ma ?? '--'}
								</Text>
							</div>
						</Col>

						{/* Giảng viên */}
						<Col xs={24} sm={12} md={6}>
							<Text style={{ color: '#888' }}>Giảng viên:</Text>
							<div>
								{(record?.nhanSuList ?? []).length > 0 ? (
									<Text strong>
										{(record?.nhanSuList ?? []).map((item, index) => (
											<span key={index}>
												<span
													className='hover-giangvien'
													style={{ cursor: 'pointer', marginRight: 4 }}
													onClick={() => {
														setSelectedGiangVien(item?.nhanSu);
														setVisibleGvDetailModal(true);
													}}
												>
													{item?.nhanSu?.hoTen}
												</span>
												{index < (record?.nhanSuList?.length ?? 0) - 1 && <span>, </span>}
											</span>
										))}
									</Text>
								) : (
									<Text style={{ color: '#999' }}>Không có</Text>
								)}
							</div>
						</Col>

						{/* Số tín chỉ */}
						<Col xs={24} sm={12} md={6}>
							<Text style={{ color: '#888' }}>Số tín chỉ:</Text>
							<div>
								<Tag
									color='red'
									style={{
										borderRadius: 4,
										fontWeight: 500,
										padding: '1px 8px',
										backgroundColor: 'rgba(255, 85, 85, 0.05)',
										border: '1px solid #ffccc7',
										color: '#ff4d4f',
									}}
								>
									{record?.hocPhan?.soTinChi ?? '--'} tín chỉ
								</Tag>
							</div>
						</Col>

						{/* Tiến trình */}
						<Col xs={24} sm={12} md={6}>
							<Text style={{ color: '#888' }}>Tiến trình môn học:</Text>
							<div>
								{isCompleted ? (
									<Tag
										style={{
											borderRadius: 4,
											fontWeight: 500,
											padding: '1px 8px',
											backgroundColor: 'rgba(255, 85, 85, 0.05)',
											border: '1px solid #ffccc7',
											color: '#ff4d4f',
										}}
									>
										Đã kết thúc
									</Tag>
								) : (
									<Tag
										style={{
											borderRadius: '4px',
											fontSize: 12,
											padding: '1px 10px',
											fontWeight: 500,
											backgroundColor: 'transparent',
											border: '1px solid #B7EB8F',
											color: '#52c41a',
										}}
									>
										Đang học
									</Tag>
								)}
							</div>
						</Col>
					</Row>
				</div>
				<Space wrap style={{ marginTop: 8 }}>
					{record?.lmsUrl ? (
						<ButtonExtend notHideText icon={<GlobalOutlined />} onClick={() => window.open(record.lmsUrl, '_blank')}>
							Học trực tuyến
						</ButtonExtend>
					) : null}
					{record?.moodleShortname ? (
						<ButtonExtend notHideText icon={<DesktopOutlined />} onClick={handleMoodle}>
							Lớp học LMS
						</ButtonExtend>
					) : null}
				</Space>
				{/* Tài liệu môn học */}
				<Card
					title='Tài liệu môn học'
					headStyle={{ border: 'none' }}
					size='small'
					style={{
						marginBottom: 16,
						border: 'none',
						padding: 0,
						borderBottom: '1px dashed transparent',
						borderImage: 'repeating-linear-gradient(to right, #ccc 0 8px, transparent 8px 16px)',
						borderImageSlice: 1,
						margin: '-16px',
						// backgroundColor: 'transparent',
					}}
					extra={
						<Button type='link' onClick={() => setVisibleHocLieu(true)} style={{ padding: 0 }}>
							Xem tất cả
						</Button>
					}
				>
					<Spin spinning={loadingHocLieu}>
						{displayHocLieu.length > 0 ? (
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{displayHocLieu.map((item, index) => (
									<div
										key={index}
										style={{
											display: 'flex',
											alignItems: 'flex-start',
											justifyContent: 'space-between',
											padding: '8px 0',
											borderBottom: index < displayHocLieu.length - 1 ? '1px solid #f0f0f0' : 'none',
										}}
									>
										<div style={{ flex: 1 }}>
											<div style={{ fontWeight: 500, fontSize: '14px', marginBottom: 4 }}>
												{item.tieuDe || 'Không có tiêu đề'}
											</div>
											<div style={{ color: '#666', fontSize: '12px', marginBottom: 2 }}>
												Tác giả: {item.tacGia || 'Chưa cập nhật'}
											</div>
											<div style={{ color: '#666', fontSize: '12px', marginBottom: 2 }}>
												NXB: {item.tenNhaXuatBan || 'Chưa cập nhật'}
												{item.namXuatBan && ` (${item.namXuatBan})`}
											</div>
											{item.moTa && (
												<div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
													{item.moTa.length > 50 ? `${item.moTa.substring(0, 50)}...` : item.moTa}
												</div>
											)}
											{item.batBuoc && (
												<Tag color='red' style={{ marginTop: 4 }}>
													Bắt buộc
												</Tag>
											)}
										</div>
										{item.url && APP_CONFIG_URL_THU_VIEN && (
											<Button
												type='text'
												size='small'
												icon={<DownloadOutlined />}
												onClick={() => window.open(APP_CONFIG_URL_THU_VIEN + item.url, '_blank')}
												title='Xem chi tiết'
											/>
										)}
									</div>
								))}
							</div>
						) : (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có tài liệu' />
						)}
					</Spin>
				</Card>
				{/* Kỹ năng đạt được */}
				<Card
					title={
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none' }}>
							<span>Kỹ năng đạt được</span>
							{kyNangDatDuoc.length > 0 && (
								<Tag color='blue' style={{ marginLeft: 8 }}>
									{kyNangDatDuoc.length} kỹ năng
								</Tag>
							)}
							{totalHours > 0 && (
								<Tag color='green' style={{ marginLeft: 4 }}>
									{totalHours} giờ học
								</Tag>
							)}
						</div>
					}
					size='small'
					headStyle={{ border: 'none' }}
					style={{
						border: 'none',
						borderBottom: '1px dashed transparent',
						borderImage: 'repeating-linear-gradient(to right, #ccc 0 8px, transparent 8px 16px)',
						borderImageSlice: 1,
						margin: '-16px',
						marginBottom: 32,
						// backgroundColor: 'transparent',
						marginTop: 32,
					}}
					extra={
						kyNangDatDuoc.length > 0 && (
							<Button
								type='link'
								onClick={() => {
									setVisibleKyNang(true);
									setActiveKyNangTab('skills');
								}}
								style={{ padding: 0, fontWeight: 500 }}
								icon={<AimOutlined />}
							>
								Xem chi tiết
							</Button>
						)
					}
				>
					{displayKyNang.length > 0 ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
							{displayKyNang.map((item: any, index: number) => renderKyNangItem(item, index, true))}
							{kyNangDatDuoc.length > 3 && (
								<div
									style={{
										textAlign: 'center',
										marginTop: 16,
										padding: '12px',
										backgroundColor: '#f8f9fa',
										borderRadius: '6px',
									}}
								>
									<Text type='secondary' style={{ fontSize: '14px' }}>
										và {kyNangDatDuoc.length - 3} kỹ năng khác...
									</Text>
									<Button
										type='link'
										size='small'
										onClick={() => {
											setVisibleKyNang(true);
											setActiveKyNangTab('skills');
										}}
										style={{ marginLeft: 8 }}
									>
										Xem tất cả
									</Button>
								</div>
							)}
						</div>
					) : (
						<div
							style={{
								textAlign: 'center',
								color: '#999',
								padding: '40px 0',
								backgroundColor: '#fafafa',
								borderRadius: '6px',
							}}
						>
							<AimOutlined style={{ fontSize: '32px', marginBottom: '12px', color: '#d9d9d9' }} />
							<div style={{ fontSize: '14px' }}>Chưa có thông tin kỹ năng đạt được</div>
							<Button
								type='link'
								size='small'
								onClick={() => {
									setVisibleKyNang(true);
									setActiveKyNangTab('content');
								}}
								style={{ marginTop: 8 }}
							>
								Xem nội dung học phần
							</Button>
						</div>
					)}
				</Card>
			</div>

			{/* <Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)} style={{ marginTop: 16 }}>
				<Tabs.TabPane tab='Danh sách sinh viên' key='-1' />
				{danhSachLopThucHanh?.map((item) => (
					<Tabs.TabPane tab={`Nhóm ${item.loai} ${item.soThuTuNhom}`} key={item._id} />
				))}
			</Tabs>

			{activeKey !== '-1' ? (
				<DanhSachGiangVien danhSachNhanSu={danhSachNhanSuLopTH} title='Giảng viên phụ trách nhóm lớp' />
			) : null}

			<DanhSachSinhVien
				sinhVienList={activeKey !== '-1' ? (recLopThucHanh?.sinhVienList ?? []) : (record?.sinhVienList ?? [])}
				loading={loading || loadingThucHanh}
				fromLopHocPhan
			/> */}

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col xs={24} lg={12}>
					<CardBaiTapLopHp lopHocPhanId={record?._id ?? ''} />
				</Col>
				<Col xs={24} lg={12}>
					<CardThongBao
						loai='lop-hoc-phan'
						idLop={record?._id}
						onShowAll={() => (window.location.hash = 'thong-bao')}
					/>
				</Col>
			</Row>

			{/* Modal Thông tin giảng viên */}
			<Modal
				title='Thông tin giảng viên'
				open={visibleGvDetailModal}
				onCancel={() => setVisibleGvDetailModal(false)}
				footer={null}
			>
				{selectedGiangVien ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
						<Row>
							<Col span={8}>
								<Text strong>Họ tên:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien.hoTen}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Email:</Text>
							</Col>
							<Col span={16}>
								<Text copyable>{selectedGiangVien.emailCanBo}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Ngày sinh:</Text>
							</Col>
							<Col span={16}>
								<Text>{moment(selectedGiangVien.ngaySinh).format('DD/MM/YYYY')}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Giới tính:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien.gioiTinh}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Học hàm:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien.hocHam || <i>Chưa cập nhật</i>}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Trình độ:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien.trinhDoDaoTao || <i>Chưa cập nhật</i>}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Chức vụ:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien?.donViViTri?.tenChucVu || <i>Chưa cập nhật</i>}</Text>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Text strong>Đơn vị:</Text>
							</Col>
							<Col span={16}>
								<Text>{selectedGiangVien?.donViChinh?.ten || <i>Chưa cập nhật</i>}</Text>
							</Col>
						</Row>
					</div>
				) : (
					<div style={{ textAlign: 'center', color: '#999' }}>Không có thông tin giảng viên</div>
				)}
			</Modal>
			{/* Modal Học liệu */}
			<Modal
				title='Học liệu đề cương'
				open={visibleHocLieu}
				onCancel={() => setVisibleHocLieu(false)}
				footer={null}
				width={1200}
			>
				<HocLieuDeCuongPage />
			</Modal>
			{/* Modal Kỹ năng đạt được với TabPane */}
			{renderKyNangModal()}
			<ModalHocPhan visible={visibleDeCuong} setVisible={setVisibleDeCuong} title='Chi tiết đề cương học phần' />
		</Spin>
	);
};

export default ThongTinChung;
