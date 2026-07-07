import { Phong } from '@/services/KyTucXa/Phong/typing';
import { CheckCircleFilled, ColumnWidthOutlined, LayoutOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Tag, Typography } from 'antd';

interface CardPhongProps {
	phong: Phong.IChinhSachPhongRecord;
	onXemChiTiet?: (phong: Phong.IChinhSachPhongRecord) => void;
	onDangKy?: (phong: Phong.IChinhSachPhongRecord) => void;
}

const ANH_PHONG_MAC_DINH =
	'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85';

const formatGia = (gia?: number | null, donViTienTe = 'VND') =>
	gia ? `${gia.toLocaleString('vi-VN')} ${donViTienTe}` : 'Chưa cập nhật';

const CardPhong = ({ phong, onXemChiTiet, onDangKy }: CardPhongProps) => {
	const room = phong.room;
	const sucChua = phong.sucChua ?? room?.soLuongToiDa ?? room?.sucChua ?? 0;
	const soChoConLai = Math.max(0, sucChua - (room?.soLuongHienTai ?? 0));
	const daHetCho = soChoConLai <= 0 || !room?.isChoThue || phong.isChoPhepDangKy === false;
	const danhSachAnh = phong.danhSachAnh?.length ? phong.danhSachAnh : room?.danhSachAnh;
	const anhPhong = danhSachAnh?.[0] || ANH_PHONG_MAC_DINH;

	const tenToaNha = room?.toaNha?.ten || room?.maToaNha;
	const tenLoaiPhong =
		phong.loaiPhongKtx?.ten ||
		room?.loaiPhongKtx?.ten ||
		room?.danhSachTinhChatPhong?.find((item) => item.congNangChinh)?.loaiPhong?.loaiPhong ||
		'CHƯA PHÂN LOẠI';

	const tienIch = phong.danhSachTienIch?.length ? phong.danhSachTienIch : (room?.danhSachTienIch ?? []);
	const tienIchHienThi = tienIch.slice(0, 3);

	return (
		<Card
			className='room-card'
			hoverable
			onClick={() => onXemChiTiet?.(phong)}
			cover={
				<div className='room-card__image-wrap'>
					<Image src={anhPhong} alt={`Phòng ${room?.ma ?? ''}`} preview={false} className='room-card__image' />

					<Tag className='room-card__slot-tag'>{daHetCho ? 'No slots left' : `${soChoConLai} slots left`}</Tag>
				</div>
			}
		>
			<Typography.Title level={4} className='room-card__title'>
				{room?.ma} · {tenToaNha} · {tenLoaiPhong}
			</Typography.Title>

			<div className='room-card__specifications'>
				<span>
					<ColumnWidthOutlined />
					{room?.dienTich ? `${room.dienTich}m2` : '- m2'}
				</span>

				<i />

				<span>
					<LayoutOutlined />
					{room?.cachBoTri || `${sucChua}/3/2`}
				</span>
			</div>

			<div className='room-card__divider' />

			<Row className='room-card__amenities' gutter={[12, 12]}>
				{tienIchHienThi.map((item) => (
					<Col key={item.maDanhMucTienIch} span={12}>
						<CheckCircleFilled />
						<Typography.Text>{item.maDanhMucTienIch}</Typography.Text>
					</Col>
				))}

				{tienIch.length > 3 && (
					<Col span={12}>
						<CheckCircleFilled />
						<Typography.Link
							onClick={(event) => {
								event.stopPropagation();
								onXemChiTiet?.(phong);
							}}
						>
							+ {tienIch.length - 3} other amenities
						</Typography.Link>
					</Col>
				)}

				{tienIch.length === 0 && (
					<Col span={24}>
						<Typography.Text type='secondary'>Tiện ích chưa được cập nhật</Typography.Text>
					</Col>
				)}
			</Row>

			<div className='room-card__divider' />

			<div className='room-card__footer'>
				<Typography.Text className='room-card__price' strong>
					{formatGia(room?.giaPhong, room?.donViTienTe)}
				</Typography.Text>

				<Button
					type='primary'
					size='large'
					disabled={daHetCho}
					onClick={(event) => {
						event.stopPropagation();
						onDangKy?.(phong);
					}}
				>
					{daHetCho ? 'FULL' : 'REGISTER'}
				</Button>
			</div>
		</Card>
	);
};

export default CardPhong;
