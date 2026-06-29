import { Button, Tooltip, Typography, Tag } from 'antd';
import { CheckIconCustom, DienTichIconCustom, PhongTamIconCustom } from './IconsRoom';
import { KyTucXa } from '@/services/KyTucXa/typings';
import './style.less';
import { useIntl, useModel, history } from 'umi';
import React, { useMemo } from 'react';

interface RoomCardProps {
	phong: KyTucXa.IPhong;
	onXemChiTiet: (phong: KyTucXa.IPhong) => void;
	onDangKy: (phong: KyTucXa.IPhong) => void;
	onDangKyHangCho?: (phong: KyTucXa.IPhong) => void;
	maPhongDaDangKy?: string;
	activeRegistrationStatus?: string;
}

const formatGia = (gia?: number, currency?: string) => {
	if (!gia) return '---';
	return gia.toLocaleString('vi-VN') + ' ' + (currency || 'VND');
};

const MAX_TIEN_ICH_SHOW = 3;

const getStatusColor = (status?: string) => {
	switch (status) {
		case 'Chờ thanh toán': return 'processing';
		case 'Đã thanh toán': return 'success';
		case 'Đã nhận phòng': return 'purple';
		default: return 'default';
	}
};

const CardRoomKTX: React.FC<RoomCardProps> = ({ phong, onXemChiTiet, onDangKy, onDangKyHangCho, maPhongDaDangKy, activeRegistrationStatus }) => {
	const intl = useIntl();
	const { danhSach: danhSachKhoanThu } = useModel('kytucxa.khoanthu');
	const { tienIchMap } = useModel('kytucxa.tienich');
	const { loaiPhongMap } = useModel('kytucxa.loaiphong');
	

	const mappedTienIchList = useMemo(() => {
		const rawList = Array.isArray(phong.danhSachTienIch) ? phong.danhSachTienIch : [];
		return rawList
			.map((it: KyTucXa.ITienIch) => {
				const key = it?.maDanhMucTienIch;
				const found = key ? tienIchMap.get(key) : undefined; 
				if (found) return found;
				return { ten: it?.maDanhMucTienIch ?? '' };
			})
			.filter(Boolean);
	}, [phong, tienIchMap]);

	const { slotLeft, mainImg, numBedLabel, tienIchShow, tienIchMore } = useMemo(() => {
		const left = Math.max(0, phong.soLuongToiDa - phong.soLuongHienTai);

		return {
			slotLeft: left,
			mainImg: phong.danhSachAnh?.[0],
			numBedLabel: [phong.ma, phong.toaNha?.ten, phong.ten].filter(Boolean).join(' · '),
			tienIchShow: mappedTienIchList.slice(0, MAX_TIEN_ICH_SHOW),
			tienIchMore: Math.max(0, mappedTienIchList.length - MAX_TIEN_ICH_SHOW),
		};
	}, [phong, mappedTienIchList, loaiPhongMap]);

	const giaPhong = useMemo(() => {
		const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
			(kt) => kt.maMucThu === phong.maKhoanThuPhong
		);
		return khoanThu?.unitAmount;
	}, [danhSachKhoanThu, phong.maKhoanThuPhong]);
	 
	const currency = useMemo(() => {
		const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
			(kt) => kt.maMucThu === phong.maKhoanThuPhong
		);
		return khoanThu?.currency;
	}, [danhSachKhoanThu, phong.maKhoanThuPhong]);

	return (
		<div
			className='ktx-room-card'
			onClick={() => onXemChiTiet(phong)}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => e.key === 'Enter' && onXemChiTiet(phong)}
		>
			<div className='ktx-room-card__img-wrap'>
				{mainImg ? (
					<img src={mainImg} alt={phong.ten} className='ktx-room-card__img' />
				) : (
					<div className='ktx-room-card__img ktx-room-card__img--placeholder' />
				)}
				<div className='ktx-room-card__badge'>
					{slotLeft > 0 && `${intl.formatMessage({ id: 'kytucxa.dangky.card.slotsLeft' }, { slotLeft })} `}
				</div>
			</div>

			<div className='ktx-room-card__body'>
				<div className='ktx-room-card__title-row'>
					<Typography.Text strong className='ktx-room-card__name'>
						{numBedLabel}
					</Typography.Text>
				</div>

				<div className='ktx-room-card__stats'>
					{!!phong.soPhongTam && (
						<span className='ktx-room-card__stat'>
							<PhongTamIconCustom />
							&nbsp;
							{phong.soPhongTam}
						</span>
					)}
					{!!phong.soPhongTam && !!phong.dienTich && <span className='ktx-room-card__dot' />}
					{!!phong.dienTich && (
						<span className='ktx-room-card__stat'>
							<DienTichIconCustom />
							&nbsp;
							{phong.dienTich}{intl.formatMessage({ id: 'kytucxa.dangky.card.m2' })}
						</span>
					)}
				</div>

				<div className='ktx-room-card__amenities'>
					{tienIchShow.map((t, i) => (
						<span key={i} className='ktx-room-card__amenity'>
							<CheckIconCustom className='ktx-room-card__amenity-icon' />
							{t.ten}
						</span>
					))}
					{tienIchMore > 0 && (
						<Tooltip
							title={mappedTienIchList
								.slice(MAX_TIEN_ICH_SHOW)
								.map((t) => t.ten)
								.join(', ')}
						>
							<span className='ktx-room-card__amenity ktx-room-card__amenity--more'>
								{intl.formatMessage({ id: 'kytucxa.dangky.card.moreAmenities' }, { tienIchMore: tienIchMore })}
							</span>
						</Tooltip>
					)}
				</div>

				<div className='ktx-room-card__divider' />

				<div className='ktx-room-card__footer'>
					<div className='ktx-room-card__price-wrap'>
						{phong.ma === maPhongDaDangKy && activeRegistrationStatus ? (
							<Tag color={getStatusColor(activeRegistrationStatus)} style={{ margin: 0, fontWeight: 500, padding: '2px 8px', fontSize: 13 }}>
								{intl.formatMessage({ id: `kytucxa.dangky.status.${activeRegistrationStatus}` })}
							</Tag>
						) : (
							<Typography.Text strong className='ktx-room-card__price'>
								{formatGia(giaPhong, currency)}
							</Typography.Text>
						)}
					</div>
					<Button
						type='primary'
						disabled={phong.ma !== maPhongDaDangKy && (phong.coTheDangKy === false || !!maPhongDaDangKy)}
						className={`ktx-room-card__btn`}
						onClick={(e) => {
							e.stopPropagation();
							if (phong.ma === maPhongDaDangKy) {
								history.push('/ky-tuc-xa/lich-su');
							} else if (slotLeft === 0) {
								if (onDangKyHangCho) onDangKyHangCho(phong);
							} else {
								onDangKy(phong);
							}
						}}
					>
						{phong.ma === maPhongDaDangKy 
							? intl.formatMessage({ id: 'kytucxa.dangky.success.paymentNow' }) 
							: slotLeft === 0 
								? intl.formatMessage({ id: 'kytucxa.dangky.card.registerWaiting' }, { defaultMessage: 'Đăng ký hàng chờ' })
								: intl.formatMessage({ id: 'kytucxa.dangky.card.register' })}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CardRoomKTX);