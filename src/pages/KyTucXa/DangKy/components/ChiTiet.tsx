import AuthImage from '@/components/Image/AuthImage';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { ETrangThaiThanhToanKTX } from '@/services/KyTucXa/PhieuDangKy/constant';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { IconLeftRightBar } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import { toast } from '@/utils/toast';
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

const ChiTietPhong = (props: {
	daCoLichSuDangKy?: boolean;
	getLichSuDangKyTheoPhong?: (phong: Phong.IChinhSachPhongRecord) => PhieuDangKyKTX.IRecord | undefined;
	isPhongDaDangKy?: (phong: Phong.IChinhSachPhongRecord) => boolean;
	onOpenLichSuDangKy?: (phong: Phong.IChinhSachPhongRecord, initialStep?: number) => void;
	chiHienThiNutDong?: boolean;
	khoaDangKy?: boolean;
}) => {
	const {
		daCoLichSuDangKy,
		getLichSuDangKyTheoPhong,
		isPhongDaDangKy,
		onOpenLichSuDangKy,
		chiHienThiNutDong,
		khoaDangKy,
	} = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, setVisibleDangKy } = useModel('kytucxa.phong');
	const { record: recLichSu } = useModel('kytucxa.phieudangky');
	const phong = record as Phong.IChinhSachPhongRecord | undefined;
	const room = phong?.room;
	const lichSuPhong = phong && getLichSuDangKyTheoPhong ? getLichSuDangKyTheoPhong(phong) : recLichSu;
	const daCoLichSuPhongDangKy =
		!!lichSuPhong?.formDon?._id &&
		lichSuPhong?.trangThaiThanhToan !== ETrangThaiThanhToanKTX.DONG &&
		lichSuPhong?.trangThaiThanhToan !== ETrangThaiThanhToanKTX.HUY;

	const laPhongDaDangKy = phong && isPhongDaDangKy ? isPhongDaDangKy(phong) : false;
	const images = getAnhPhongHienThi(phong);
	const tienIch = getTienIchPhong(phong);
	const tenPhong = phong ? getTenPhong(phong, intl) : '';
	const soSlotConLai = getSoChoConLai(phong);
	const daHetCho = getDaHetCho(phong);
	const trangThaiThanhToan = lichSuPhong?.trangThaiThanhToan;
	const daThanhToanXong = trangThaiThanhToan === ETrangThaiThanhToanKTX.DA_HOAN_THANH_COC;
	const daQuaHanThanhToan =
		trangThaiThanhToan === ETrangThaiThanhToanKTX.DONG || trangThaiThanhToan === ETrangThaiThanhToanKTX.HUY;
	const hienThiNhuDaDangKy = laPhongDaDangKy && !daQuaHanThanhToan;
	const khongChoDangKy = !hienThiNhuDaDangKy && (khoaDangKy || daHetCho || daCoLichSuPhongDangKy || daCoLichSuDangKy);
	const buttonText = hienThiNhuDaDangKy
		? daThanhToanXong
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.seeMore' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.paymentNow' })
		: daHetCho
			? intl.formatMessage({ id: 'kytucxa.dangky.card.button.full' })
			: intl.formatMessage({ id: 'kytucxa.dangky.card.button.dangKy' });

	const handleDangKy = () => {
		if (khoaDangKy) return;

		if (daCoLichSuPhongDangKy || (!lichSuPhong && daCoLichSuDangKy)) {
			toast.warning(intl.formatMessage({ id: 'kytucxa.dangky.message.daCoLichSu' }));
			return;
		}

		setVisibleForm(false);
		setVisibleDangKy(true);
	};

	const handleClickButton = () => {
		if (hienThiNhuDaDangKy) {
			if (phong) onOpenLichSuDangKy?.(phong, daThanhToanXong ? 0 : 3);
			return;
		}

		handleDangKy();
	};

	return (
		<ModalExpandable
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			title={intl.formatMessage({ id: 'kytucxa.dangky.chitiet.title' })}
		>
			<div
				className={['room-gallery', images.length <= 1 ? 'room-gallery-single' : undefined].filter(Boolean).join(' ')}
			>
				<div>
					<AuthImage
						src={images?.[0]}
						alt='room-main'
						width='100%'
						height={372}
						style={{ objectFit: 'cover' }}
						isDetail
						preview={{
							mask: intl.formatMessage({ id: 'kytucxa.dangky.chitiet.xemAnh' }),
						}}
					/>
				</div>

				<div className='room-gallery-side'>
					{images?.slice(1, 5).map((src: string, index: number) => (
						<div key={index}>
							<AuthImage
								src={src}
								alt={`room-${index}`}
								width='100%'
								height={182}
								style={{ objectFit: 'cover' }}
								isDetail
								preview={{
									mask: intl.formatMessage({ id: 'kytucxa.dangky.chitiet.xemAnh' }),
								}}
							/>
						</div>
					))}
				</div>
			</div>

			<Row gutter={16} className='room-info-wrap'>
				<Col span={18}>
					<h3 className='room-name'>{tenPhong}</h3>

					{record?.room?.dienTich ? (
						<div className='room-summary'>
							<IconLeftRightBar /> <span>{record?.room?.dienTich}m2</span>
						</div>
					) : null}

					<div className='room-card__divider' />

					<Row gutter={[12, 8]} className='room-utilities'>
						{tienIch.map((item: any) => {
							const label = item?.tienIch?.ten ?? item?.maDanhMucTienIch;
							const image = item?.tienIch?.anh;

							return (
								<Col span={8} key={label}>
									<span className='utility-item'>
										{image ? <AuthImage className='utility-item__image' src={image} alt={label} /> : <CheckOutlined />}
										<span>{label}</span>
									</span>
								</Col>
							);
						})}

						{tienIch.length === 0 && (
							<Col span={24}>
								<Typography.Text type='secondary'>
									{intl.formatMessage({ id: 'kytucxa.dangky.card.tienIchChuaCapNhat' })}
								</Typography.Text>
							</Col>
						)}
					</Row>
				</Col>

				<Col span={6}>
					<div className='room-price-box'>
						<div className='room-price'>{formatGiaPhong(room?.giaPhong, room?.donViTienTe, intl)}</div>

						<div className='room-available-box'>
							<div>{intl.formatMessage({ id: 'kytucxa.dangky.chitiet.available' })}</div>
							<strong>
								{intl.formatMessage({ id: 'kytucxa.dangky.chitiet.slotConLai' }, { soLuong: soSlotConLai })}
							</strong>
						</div>
					</div>
				</Col>
			</Row>

			<div className='room-card__divider' />

			<div className='room-description'>
				{phong?.moTa || room?.moTa || intl.formatMessage({ id: 'kytucxa.dangky.chitiet.defaultDescription' })}
			</div>

			<div className='form-footer'>
				{chiHienThiNutDong ? null : (
					<Button type='primary' disabled={khongChoDangKy} onClick={handleClickButton}>
						{buttonText}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default ChiTietPhong;
