import { Phong } from '@/services/KyTucXa/Phong/typing';
import { CheckCircleFilled, ColumnWidthOutlined, LayoutOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Tag, Typography } from 'antd';
import { history, useIntl, useModel } from 'umi';

interface CardPhongProps {
	phong: Phong.IChinhSachPhongRecord;
	daCoLichSuDangKy?: boolean;
	laPhongDaDangKy?: boolean;
	onXemChiTiet?: (phong: Phong.IChinhSachPhongRecord) => void;
	onDangKy?: (phong: Phong.IChinhSachPhongRecord) => void;
}

const getPaymentTag = (status?: string, intl?: any) => {
	switch (status) {
		case 'Đã thanh toán':
		case 'Paid':
			return <Tag color='success'>{intl.formatMessage({ id: 'kytucxa.lichsu.status.paid' })}</Tag>;
		case 'Thanh toán thiếu':
		case 'Underpaid':
			return <Tag color='warning'>{intl.formatMessage({ id: 'kytucxa.lichsu.status.underpaid' })}</Tag>;
		default:
			return <Tag>{status || '--'}</Tag>;
	}
};

const ANH_PHONG_MAC_DINH =
	'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85';

const CardPhong = ({ phong, daCoLichSuDangKy, laPhongDaDangKy, onXemChiTiet, onDangKy }: CardPhongProps) => {
	const intl = useIntl();
	const { record: recLichSu } = useModel('kytucxa.phieudangky');
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
		intl.formatMessage({ id: 'kytucxa.dangky.card.chuaPhanLoai' });

	const tienIch = phong.danhSachTienIch?.length ? phong.danhSachTienIch : (room?.danhSachTienIch ?? []);
	const tienIchHienThi = tienIch.slice(0, 3);

	const formatGia = (gia?: number | null, donViTienTe = 'VND') =>
		gia
			? `${gia.toLocaleString('vi-VN')} ${donViTienTe}`
			: intl.formatMessage({ id: 'kytucxa.dangky.card.chuaCapNhat' });

	const trangThaiThanhToan = recLichSu?.trangThaiThanhToan;
	const daThanhToanXong = trangThaiThanhToan === 'Đã thanh toán' || trangThaiThanhToan === 'Paid';
	const hienThiTagThanhToan =
		laPhongDaDangKy &&
		(trangThaiThanhToan === 'Thanh toán thiếu' ||
			trangThaiThanhToan === 'Underpaid' ||
			daThanhToanXong);

	const khongChoDangKy = (laPhongDaDangKy && daThanhToanXong) || (!laPhongDaDangKy && (daHetCho || daCoLichSuDangKy));

	return (
		<Card
			className={['room-card', laPhongDaDangKy ? 'room-card--registered' : undefined].filter(Boolean).join(' ')}
			hoverable
			onClick={() => onXemChiTiet?.(phong)}
			cover={
				<div className='room-card__image-wrap'>
					<Image
						src={anhPhong}
						alt={intl.formatMessage({ id: 'kytucxa.dangky.card.imageAlt' }, { maPhong: room?.ma ?? '' })}
						preview={false}
						className='room-card__image'
					/>

					<Tag className='room-card__slot-tag'>
						{daHetCho
							? intl.formatMessage({ id: 'kytucxa.dangky.card.hetCho' })
							: intl.formatMessage({ id: 'kytucxa.dangky.card.slotConLai' }, { soLuong: soChoConLai })}
					</Tag>
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
							{intl.formatMessage({ id: 'kytucxa.dangky.card.tienIchKhac' }, { soLuong: tienIch.length - 3 })}
						</Typography.Link>
					</Col>
				)}

				{tienIch.length === 0 && (
					<Col span={24}>
						<Typography.Text type='secondary'>
							{intl.formatMessage({ id: 'kytucxa.dangky.card.tienIchChuaCapNhat' })}
						</Typography.Text>
					</Col>
				)}
			</Row>

			<div className='room-card__divider' />

			<div className='room-card__footer'>
				{hienThiTagThanhToan ? (
					getPaymentTag(trangThaiThanhToan, intl)
				) : (
					<Typography.Text className='room-card__price' strong>
						{formatGia(room?.giaPhong, room?.donViTienTe)}
					</Typography.Text>
				)}

				<Button
					type='primary'
					size='large'
					disabled={khongChoDangKy}
					onClick={(event) => {
						event.stopPropagation();
						if (laPhongDaDangKy) {
							history.push('/campus-life/student-housing/lich-su');
						} else {
							onDangKy?.(phong);
						}
					}}
				>
					{laPhongDaDangKy
						? daThanhToanXong
							? intl.formatMessage({ id: 'kytucxa.dangky.card.button.seeMore' })
							: intl.formatMessage({ id: 'kytucxa.dangky.card.button.paymentNow' })
						: daHetCho
							? intl.formatMessage({ id: 'kytucxa.dangky.card.button.full' })
							: intl.formatMessage({ id: 'kytucxa.dangky.card.button.dangKy' })}
				</Button>
			</div>
		</Card>
	);
};

export default CardPhong;
