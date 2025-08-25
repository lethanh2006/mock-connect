import { Avatar, Col, Descriptions, Modal, Row, Typography } from 'antd';

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
	anhDaiDienUrl?: string;
}

const ModalThongTinGiangVien = ({
	visible,
	onCancel,
	giangVien,
}: {
	visible: boolean;
	onCancel: () => void;
	giangVien?: GiangVien | null;
}) => {
	return (
		<Modal title='Thông tin giảng viên' open={visible} onCancel={onCancel} footer={null} width={800}>
			{giangVien ? (
				<Row gutter={[0, 12]}>
					<Col span={24} md={8} style={{ textAlign: 'center' }}>
						<Avatar
							src={giangVien?.anhDaiDienUrl || `/images/${giangVien?.gioiTinh === 'Nữ' ? 'female.svg' : 'male.svg'}`}
							size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
						/>
					</Col>
					<Col span={24} md={16}>
						<Descriptions bordered column={1} size='small'>
							<Descriptions.Item label='Họ tên'>{giangVien?.hoTen}</Descriptions.Item>
							<Descriptions.Item label='Email'>
								<Typography.Text copyable>{giangVien?.emailCanBo}</Typography.Text>
							</Descriptions.Item>
							<Descriptions.Item label='Giới tính'>{giangVien?.gioiTinh || 'Chưa cập nhật'}</Descriptions.Item>
							{/* <Descriptions.Item label='Ngày sinh'>
								{giangVien?.ngaySinh ? dayjs(giangVien.ngaySinh).format('DD/MM/YYYY') : 'Chưa cập nhật'}
							</Descriptions.Item> */}
							<Descriptions.Item label='Học hàm'>{giangVien?.hocHam || 'Chưa cập nhật'}</Descriptions.Item>
							<Descriptions.Item label='Trình độ'>{giangVien?.trinhDoDaoTao || 'Chưa cập nhật'}</Descriptions.Item>
							{/* <Descriptions.Item label='Chức vụ'>
								{giangVien?.donViViTri?.tenChucVu || 'Chưa cập nhật'}
							</Descriptions.Item> */}
							{/* <Descriptions.Item label='Đơn vị'>{giangVien?.donViChinh?.ten || 'Chưa cập nhật'}</Descriptions.Item> */}
						</Descriptions>
					</Col>
				</Row>
			) : (
				<div style={{ textAlign: 'center', color: '#999' }}>Không có thông tin giảng viên</div>
			)}
		</Modal>
	);
};

export default ModalThongTinGiangVien;
