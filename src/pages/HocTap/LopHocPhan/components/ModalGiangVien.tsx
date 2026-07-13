import { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { getPublicAssetPath } from '@/utils/path';
import { Avatar, Col, Descriptions, Modal, Row, Typography } from 'antd';
import { useIntl } from 'umi';

const ModalThongTinGiangVien = ({
	visible,
	onCancel,
	giangVien,
}: {
	visible: boolean;
	onCancel: () => void;
	giangVien?: ToChucNhanSu.INhanSu | null;
}) => {
	const intl = useIntl();

	return (
		<Modal
			title={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.thongtingv' })}
			open={visible}
			onCancel={onCancel}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={800}
		>
			{giangVien ? (
				<Row gutter={[0, 12]} align='middle'>
					<Col span={24} md={8} style={{ textAlign: 'center' }}>
						<Avatar
							src={
								giangVien?.urlAnhDaiDien ||
								getPublicAssetPath(`images/${giangVien?.gioiTinh === 'Nữ' ? 'female.svg' : 'male.svg'}`)
							}
							size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
						/>
					</Col>
					<Col span={24} md={16}>
						<Descriptions bordered column={1} size='small'>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.hoTen' })}>
								{giangVien?.hoTen}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.email' })}>
								<Typography.Text copyable>{giangVien?.emailCanBo}</Typography.Text>
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.gioitinh' })}>
								{giangVien?.gioiTinh || intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chuacapnhat' })}
							</Descriptions.Item>
							{/* <Descriptions.Item label='Ngày sinh'>
								{giangVien?.ngaySinh ? formatDate(giangVien.ngaySinh) : 'Chưa cập nhật'}
							</Descriptions.Item> */}
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.hocham' })}>
								{giangVien?.hocHam || intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chuacapnhat' })}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.trinhdo' })}>
								{giangVien?.trinhDoDaoTao ||
									intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chuacapnhat' })}
							</Descriptions.Item>
							{/* <Descriptions.Item label='Số điện thoại'>{giangVien?.sdtCaNhan || 'Chưa cập nhật'}</Descriptions.Item> */}

							{/* <Descriptions.Item label='Chức vụ'>
								{giangVien?.donViViTri?.tenChucVu || 'Chưa cập nhật'}
							</Descriptions.Item> */}
							{/* <Descriptions.Item label='Đơn vị'>{giangVien?.donViChinh?.ten || 'Chưa cập nhật'}</Descriptions.Item> */}
						</Descriptions>
					</Col>
				</Row>
			) : (
				<div style={{ textAlign: 'center', color: '#999' }}>
					{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.empty' })}
				</div>
			)}
		</Modal>
	);
};

export default ModalThongTinGiangVien;
