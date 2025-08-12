import ButtonExtend from '@/components/Table/ButtonExtend';
import ThongTinChungPage from '@/pages/DaoTao/DeCuongHocPhan/components/ThongTinChung';
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
import './style.less';

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
	const {
		danhSach: danhSachHocLieu,
		loading: loadingHocLieu,
		getModel: getHocLieuDeCuong,
	} = useModel('hocphan.hoclieudecuong');
	const { danhSach: danhSachNoiDungHocPhan } = useModel('hocphan.noidunghp');

	const deCuongId = record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;

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
	const [visibleHocLieu, setVisibleHocLieu] = useState<boolean>(false);
	const [visibleKyNang, setVisibleKyNang] = useState<boolean>(false);
	const [activeKyNangTab, setActiveKyNangTab] = useState<string>('content');

	// Lấy dữ liệu kỹ năng
	const kyNangDatDuoc = recDeCuong?.kyNangDatDuoc || recDeCuong?.ketQuaDatDuoc || [];

	// Hiển thị 3 kỹ năng đầu tiên trong card
	// const displayKyNang = kyNangDatDuoc.slice(0, 3);

	// Tính toán tổng số giờ học từ nội dung học phần
	// const totalHours =
	// 	danhSachNoiDungHocPhan?.reduce((total, item) => {
	// 		return total + (item.gioLyThuyet || 0) + (item.gioBaiTapTL || 0) + (item.gioThucHanh || 0) + (item.gioTuHoc || 0);
	// 	}, 0) || 0;

	useEffect(() => {
		setActiveKey('-1');

		// if (deCuongId) {
		getHocLieuDeCuong({ deCuongId: deCuongId });
		// }
	}, [deCuongId]);

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
		<div key={index} className={`ky-nang-item ${isPreview ? 'preview' : 'detail'}`}>
			<div className='ky-nang-number'>
				<Text>{index + 1}</Text>
			</div>
			<div className='ky-nang-content'>
				<div className='ky-nang-title'>{item.tieuDe || item.ten || item.kyNang || 'Không có tiêu đề'}</div>
				{item.moTa && (
					<div className='ky-nang-description'>
						{isPreview && item.moTa.length > 120 ? `${item.moTa.substring(0, 120)}...` : item.moTa}
					</div>
				)}
				<div className='ky-nang-tags'>
					{item.mucDo && (
						<Tag
							className={`ky-nang-tag ${
								item.mucDo === 'Cao' ? 'muc-do-cao' : item.mucDo === 'Trung bình' ? 'muc-do-trung-binh' : 'muc-do-thap'
							}`}
							color={item.mucDo === 'Cao' ? 'red' : item.mucDo === 'Trung bình' ? 'orange' : 'green'}
						>
							Mức độ: {item.mucDo}
						</Tag>
					)}
					{item.loaiKyNang && (
						<Tag color='blue' className='ky-nang-tag'>
							{item.loaiKyNang}
						</Tag>
					)}
					{item.thoiGianHoc && (
						<Tag color='purple' className='ky-nang-tag'>
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
				<div className='modal-title'>
					<AimOutlined />
					<span>Kỹ năng & Nội dung học phần</span>
				</div>
			}
			open={visibleKyNang}
			onCancel={() => setVisibleKyNang(false)}
			footer={null}
			width={1200}
			className='modal-ky-nang'
		>
			<Tabs activeKey={activeKyNangTab} onChange={setActiveKyNangTab} size='large'>
				<Tabs.TabPane
					tab={
						<span>
							<BookOutlined />
							Nội dung học phần
						</span>
					}
					key='content'
				>
					<NoiDungHocPhanPage />
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
					{kyNangDatDuoc.length > 0 ? (
						<div className='ky-nang-items'>
							{kyNangDatDuoc.map((item: any, index: number) => renderKyNangItem(item, index, false))}
						</div>
					) : (
						<div className='empty-ky-nang-modal'>
							<AimOutlined />
							<div>Chưa có thông tin kỹ năng đạt được</div>
						</div>
					)}
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
					<ThongTinChungPage />
				</Tabs.TabPane>
			</Tabs>
		</Modal>
	);

	return (
		<Spin spinning={loading}>
			<div className='thong-tin-chung-container'>
				<div className='gioi-thieu-section'>
					<GioiThieuChungLopHp />
				</div>
				<div className='thong-tin-co-ban'>
					<Row gutter={[16, 16]} className='thong-tin-row'>
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
								<Tag className='tag-so-tin-chi'>{record?.hocPhan?.soTinChi ?? '--'} tín chỉ</Tag>
							</div>
						</Col>

						{/* Tiến trình */}
						<Col xs={24} sm={12} md={6}>
							<Text style={{ color: '#888' }}>Tiến trình môn học:</Text>
							<div>
								{isCompleted ? (
									<Tag className='tag-da-ket-thuc'>Đã kết thúc</Tag>
								) : (
									<Tag className='tag-dang-hoc'>Đang học</Tag>
								)}
							</div>
						</Col>
					</Row>
				</div>
				<Space wrap className='button-space'>
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
					size='small'
					className='tai-lieu-card'
					extra={
						<Button
							type='link'
							className='btn-extra'
							onClick={() => setVisibleHocLieu(true)}
							disabled={danhSachHocLieu.length === 0}
						>
							Xem tất cả
						</Button>
					}
				>
					<Spin spinning={loadingHocLieu}>
						{displayHocLieu.length > 0 ? (
							<div>
								{displayHocLieu.map((item, index) => (
									<div key={index} className='hoc-lieu-item'>
										<div className='hoc-lieu-content'>
											<div className='hoc-lieu-title'>{item.tieuDe || 'Không có tiêu đề'}</div>
											<div className='hoc-lieu-author'>Tác giả: {item.tacGia || 'Chưa cập nhật'}</div>
											<div className='hoc-lieu-publisher'>
												NXB: {item.tenNhaXuatBan || 'Chưa cập nhật'}
												{item.namXuatBan && ` (${item.namXuatBan})`}
											</div>
											{item.moTa && (
												<div className='hoc-lieu-description'>
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
				{/* Kỹ năng đạt được  */}
				{/* Tạm thời chưa có api và dữ liệu nên comment lại */}
				{/* <Card
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
					className='ky-nang-card'
					extra={
						kyNangDatDuoc.length > 0 && (
							<Button
								type='link'
								onClick={() => {
									setVisibleKyNang(true);
									setActiveKyNangTab('skills');
								}}
								className='btn-extra detail-btn'
								icon={<AimOutlined />}
							>
								Xem chi tiết
							</Button>
						)
					}
				>
					{displayKyNang.length > 0 ? (
						<div className='ky-nang-items'>
							{displayKyNang.map((item: any, index: number) => renderKyNangItem(item, index, true))}
							{kyNangDatDuoc.length > 3 && (
								<div className='more-skills'>
									<Text type='secondary' className='more-skills-text'>
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
						<div className='empty-ky-nang'>
							<AimOutlined />
							<div>Chưa có thông tin kỹ năng đạt được</div>
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
				</Card> */}
			</div>

			<Row gutter={[16, 16]} className='card-content'>
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
					<div className='giang-vien-info'>
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
					<div className='giang-vien-empty'>Không có thông tin giảng viên</div>
				)}
			</Modal>
			{/* Modal Học liệu */}
			{/* <Modal
				title='Học liệu đề cương'
				open={visibleHocLieu}
				onCancel={() => {
					setVisibleHocLieu(false);
				}}
				footer={null}
				width={1200}
			> */}
			{/* <HocLieuDeCuongPage /> */}
			<ModalHocPhan
				visible={visibleHocLieu}
				setVisible={() => {
					setVisibleHocLieu(false);
				}}
				title='Chi tiết đề cương học phần'
				activeKey={'3'}
			/>
			{/* </Modal> */}
			{/* Modal Kỹ năng đạt được với TabPane */}
			{renderKyNangModal()}
		</Spin>
	);
};

export default ThongTinChung;
