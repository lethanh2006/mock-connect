import AuthImage from '@/components/Image/AuthImage';
import {
	ETrangThaiThanhToanKTX,
	ETrangThaiThanhToanKTXColor,
	ETrangThaiThanhToanKTXI18n,
} from '@/services/KyTucXa/PhieuDangKy/constant';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { CheckCircleFilled, ColumnWidthOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
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
	lichSuDangKy?: PhieuDangKyKTX.IRecord;
	daCoLichSuDangKy?: boolean;
	laPhongDaDangKy?: boolean;
	onOpenLichSuDangKy?: (phong: Phong.IChinhSachPhongRecord, initialStep?: number) => void;
	onXemChiTiet?: (phong: Phong.IChinhSachPhongRecord) => void;
	onDangKy?: (phong: Phong.IChinhSachPhongRecord) => void;
}

const CardPhong = ({
	phong,
	lichSuDangKy,
	daCoLichSuDangKy,
	laPhongDaDangKy,
	onOpenLichSuDangKy,
	onXemChiTiet,
	onDangKy,
}: CardPhongProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { record: recLichSu } = useModel('kytucxa.phieudangky');
	const lichSuPhong = lichSuDangKy ?? recLichSu;
	const room = phong.room;
	const soChoConLai = getSoChoConLai(phong);
	const daHetCho = getDaHetCho(phong);
	const anhPhong = getAnhPhongHienThi(phong)[0];
	const tenPhong = getTenPhong(phong, intl);
	const tienIch = getTienIchPhong(phong);
	const tienIchHienThi = tienIch.slice(0, 3);

	const trangThaiThanhToan = lichSuPhong?.trangThaiThanhToan;
	const daThanhToanXong = trangThaiThanhToan === ETrangThaiThanhToanKTX.DA_HOAN_THANH_COC;
	const daQuaHanThanhToan =
		trangThaiThanhToan === ETrangThaiThanhToanKTX.DONG || trangThaiThanhToan === ETrangThaiThanhToanKTX.HUY;
	const hienThiNhuDaDangKy = laPhongDaDangKy && !daQuaHanThanhToan;

	const khongChoDangKy = !hienThiNhuDaDangKy && (daHetCho || daCoLichSuDangKy);
	const buttonText = hienThiNhuDaDangKy
		? daThanhToanXong
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.seeMore' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.paymentNow' })
		: daHetCho
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.full' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.dangKy' });

	const renderTrangThaiThanhToan = (value?: string) => {
		const paymentStatus = value as ETrangThaiThanhToanKTX;
		const intlId = ETrangThaiThanhToanKTXI18n[paymentStatus];
		return (
			<Tag
				style={{
					maxWidth: 90,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					display: 'inline-block',
				}}
				title={(intlId && t(intlId)) || '--'}
				color={ETrangThaiThanhToanKTXColor[paymentStatus] ?? 'default'}
			>
				{(intlId && t(intlId)) || '--'}
			</Tag>
		);
	};

	return (
		<Card
			className={['room-card', hienThiNhuDaDangKy ? 'room-card--registered' : undefined].filter(Boolean).join(' ')}
			hoverable
			onClick={() => onXemChiTiet?.(phong)}
			cover={
				<div className='room-card__image-wrap'>
					<AuthImage
						src={anhPhong}
						alt={intl.formatMessage({ id: 'kytucxa.dangky.card.imageAlt' }, { maPhong: room?.ma ?? '' })}
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
				{hienThiNhuDaDangKy ? (
					renderTrangThaiThanhToan()
				) : (
					<Typography.Text className='room-card__price' strong>
						{formatGiaPhong(room?.giaPhong, room?.donViTienTe, intl)}
					</Typography.Text>
				)}

				<Button
					type={hienThiNhuDaDangKy && daThanhToanXong ? 'default' : 'primary'}
					size='large'
					disabled={khongChoDangKy}
					className={hienThiNhuDaDangKy && daThanhToanXong ? 'room-card__button--secondary' : undefined}
					onClick={(event) => {
						event.stopPropagation();
						if (hienThiNhuDaDangKy) {
							onOpenLichSuDangKy?.(phong, daThanhToanXong ? 0 : 3);
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
