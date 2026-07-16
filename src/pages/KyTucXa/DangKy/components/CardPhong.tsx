import { Phong } from '@/services/KyTucXa/Phong/typing';
import { EMaTrangThaiThanhToan, ETrangThaiThanhToanKtxI18n } from '@/services/TaiChinh/constant';
import { CheckCircleFilled, ColumnWidthOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Row, Space, Tag, Typography } from 'antd';
import { history, useIntl, useModel } from 'umi';
import '../style.less';
import {
	formatGiaPhong,
	getAnhPhongHienThi,
	getDaHetCho,
	getSoChoConLai,
	getTenPhong,
	getTienIchPhong,
} from '../utils';

interface CardPhongProps {
	phong: Phong.IChinhSachPhongRecord;
	daCoLichSuDangKy?: boolean;
	laPhongDaDangKy?: boolean;
	onXemChiTiet?: (phong: Phong.IChinhSachPhongRecord) => void;
	onDangKy?: (phong: Phong.IChinhSachPhongRecord) => void;
}

const getPaymentTag = (status: EMaTrangThaiThanhToan | undefined, intl: any) => {
	if (!status) return <Tag>--</Tag>;

	const messageId = ETrangThaiThanhToanKtxI18n[status];
	if (!messageId) return <Tag>--</Tag>;

	return (
		<Tag className={`room-card__payment-tag room-card__payment-tag--${status}`}>
			{intl.formatMessage({ id: messageId })}
		</Tag>
	);
};

const CardPhong = ({ phong, daCoLichSuDangKy, laPhongDaDangKy, onXemChiTiet, onDangKy }: CardPhongProps) => {
	const intl = useIntl();
	const { record: recLichSu } = useModel('kytucxa.phieudangky');
	const room = phong.room;
	const soChoConLai = getSoChoConLai(phong);
	const daHetCho = getDaHetCho(phong);
	const anhPhong = getAnhPhongHienThi(phong)[0];
	const tenPhong = getTenPhong(phong, intl);
	const tienIch = getTienIchPhong(phong);
	const tienIchHienThi = tienIch.slice(0, 3);

	const trangThaiThanhToan = recLichSu?.trangThaiThanhToan;
	const daThanhToanXong = trangThaiThanhToan === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU;

	const khongChoDangKy = !laPhongDaDangKy && (daHetCho || daCoLichSuDangKy);
	const buttonText = laPhongDaDangKy
		? daThanhToanXong
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.seeMore' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.paymentNow' })
		: daHetCho
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.full' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.dangKy' });

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
			<div className='room-card__title'>{tenPhong}</div>

			{room?.dienTich ? (
				<div className='room-card__specifications'>
					<Space>
						<ColumnWidthOutlined />
						{`${room.dienTich}m2`}
					</Space>
				</div>
			) : null}

			<div className='room-card__divider' />

			<Row className='room-card__amenities' gutter={[12, 12]}>
				{tienIchHienThi.map((item: any) => (
					<Col key={item.maDanhMucTienIch} span={12}>
						<CheckCircleFilled />
						<Typography.Text>{item?.tienIch?.ten ?? item?.maDanhMucTienIch}</Typography.Text>
					</Col>
				))}

				{tienIch.length > 3 && (
					<Col span={12}>
						<CheckCircleFilled />
						<Typography.Link
							style={{ color: '#0087C3', fontWeight: 'normal' }}
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
				{laPhongDaDangKy ? (
					getPaymentTag(trangThaiThanhToan, intl)
				) : (
					<Typography.Text className='room-card__price' strong>
						{formatGiaPhong(room?.giaPhong, room?.donViTienTe, intl)}
					</Typography.Text>
				)}

				<Button
					type={laPhongDaDangKy && daThanhToanXong ? 'default' : 'primary'}
					size='large'
					disabled={khongChoDangKy}
					className={laPhongDaDangKy && daThanhToanXong ? 'room-card__button--secondary' : undefined}
					onClick={(event) => {
						event.stopPropagation();
						if (laPhongDaDangKy) {
							history.push('/campus-life/student-housing/lich-su');
						} else {
							onDangKy?.(phong);
						}
					}}
				>
					{buttonText}
				</Button>
			</div>
		</Card>
	);
};

export default CardPhong;
