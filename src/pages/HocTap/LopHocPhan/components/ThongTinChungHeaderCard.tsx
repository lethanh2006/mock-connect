import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { Col, message, Modal, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DanhSachGiangVien from './DanhSachGiangVien';

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

const { Title, Text } = Typography;

const ThongTinChungHeaderCard = () => {
	const { loading, record, getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
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

	const [selectedGiangVien, setSelectedGiangVien] = useState<GiangVien | null>(null);
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);

	const Isolation_Mode_1 = '/images/isolation-mode-1.png';
	const Isolation_Mode_2 = '/images/isolation-mode-2.png';
	const Isolation_Mode_3 = '/images/isolation-mode-3.png';
	const Isolation_Mode_4 = '/images/isolation-mode-4.png';
	const backgrounds = [Isolation_Mode_1, Isolation_Mode_2, Isolation_Mode_3, Isolation_Mode_4];
	const backgroundRef = useRef(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
	const randomBackground = backgroundRef.current;

	useEffect(() => {
		setActiveKey('-1');
		if (record?._id) {
			getLopThucHanh({ tenCha: record?.ten });
		}
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

	return (
		<Spin spinning={loading}>
			<div
				style={{
					padding: '20px 20px 0',
					backgroundColor: ' #FFE9E9',
					margin: '-24px -16px 0', // để phần Header này theo đúng thiết kế (sát vào lề)
					backgroundImage: `url(${randomBackground})`,
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'right center',
				}}
			>
				{/* Header Title */}
				<div
					style={{
						marginBottom: '16px',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'baseline',
						gap: '16px',
					}}
				>
					<Title level={4} style={{ margin: 0, color: '#333' }}>
						{record?.hocPhan?.ten ? (
							<Tooltip title='Xem đề cương chi tiết học phần'>
								<a onClick={() => setVisibleDeCuong(true)} style={{ color: '#333' }}>
									{record?.hocPhan?.ten ?? ''}
								</a>
							</Tooltip>
						) : (
							<i>Chưa cập nhật</i>
						)}
					</Title>

					<Tag
						style={{
							borderRadius: '4px',
							fontSize: 12,
							padding: '1px 10px',
							fontWeight: 500,
							backgroundColor: 'transparent',
							color: '#ff7677',
							border: '1px solid rgb(253, 197, 191)',
						}}
					>
						{record?.hocPhan?.soTinChi ?? '--'} tín chỉ
					</Tag>
					{isCompleted ? (
						<Tag
							style={{
								borderRadius: '4px',
								fontSize: 12,
								padding: '1px 10px',
								fontWeight: 500,
								backgroundColor: 'transparent',
								color: '#ff7677',
								border: '1px solid rgb(253, 197, 191)',
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

				{/* Info Row */}
				<Row gutter={[24, 0]} style={{ marginBottom: '36px' }}>
					<Col>
						<Text>Mã học phần:</Text>
						<Text strong style={{ marginLeft: '8px', color: '#1890ff' }}>
							{record?.hocPhan?.ma ?? ''}
						</Text>
					</Col>
					<Col>
						<Text>Kỳ học:</Text>
						<Text strong style={{ marginLeft: '8px' }}>
							{record?.hocKy?.ten ?? ''}
						</Text>
					</Col>
					<Col>
						<Text>Giảng viên:</Text>
						{(record?.nhanSuList ?? []).length > 0 ? (
							<Text strong style={{ marginLeft: 8 }}>
								{(record?.nhanSuList ?? []).map((item, index) => (
									<span key={index}>
										<Text
											style={{
												cursor: 'pointer',
												marginRight: 4,
												transition: 'color 0.3s ease',
											}}
											onClick={() => {
												setSelectedGiangVien(item?.nhanSu);
												setVisibleGvDetailModal(true);
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.color = '#1890ff';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.color = '';
											}}
										>
											{item?.nhanSu?.hoTen}
										</Text>
										{index < (record?.nhanSuList?.length ?? 0) - 1 && <span>, </span>}
									</span>
								))}
							</Text>
						) : (
							<Text style={{ marginLeft: 8, color: '#999' }}>Không có</Text>
						)}
					</Col>
				</Row>

				{/* Action Buttons */}
				<Space wrap style={{ marginBottom: '16px' }}>
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

				{activeKey !== '-1' ? (
					<DanhSachGiangVien danhSachNhanSu={danhSachNhanSuLopTH} title='Giảng viên phụ trách nhóm lớp' />
				) : null}

				<ModalHocPhan visible={visibleDeCuong} setVisible={setVisibleDeCuong} title='Chi tiết đề cương học phần' />
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
			</div>
		</Spin>
	);
};

export default ThongTinChungHeaderCard;
