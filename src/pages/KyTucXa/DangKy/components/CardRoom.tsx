import { Button, Tooltip, Typography } from 'antd';
import { CheckIconCustom, DienTichIconCustom, ExpandIconCustom } from './IconsRoom';
import { KyTucXa } from '@/services/KyTucXa/typings';
import './style.less';
import { useIntl, useModel } from 'umi';
import React, { useMemo } from 'react';

interface RoomCardProps {
	phong: KyTucXa.IPhong;
	onXemChiTiet: (phong: KyTucXa.IPhong) => void;
	onDangKy: (phong: KyTucXa.IPhong) => void;
	maPhongDaDangKy?: string;
}

const formatGia = (gia?: number, currency?: string) => {
	if (!gia) return '---';
	return gia.toLocaleString('vi-VN') + ' ' + (currency || 'VND');
};

const MAX_TIEN_ICH_SHOW = 3;

const CardRoomKTX: React.FC<RoomCardProps> = ({ phong, onXemChiTiet, onDangKy, maPhongDaDangKy }) => {
	const intl = useIntl();
	const { danhSach: danhSachKhoanThu } = useModel('kytucxa.khoanthu');
	const { tienIchMap } = useModel('kytucxa.tienich');
	

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
			numBedLabel: `${intl.formatMessage({ id: 'kytucxa.dangky.card.bedRoom' }, { soLuongToiDa: phong.soLuongToiDa })}`,
			tienIchShow: mappedTienIchList.slice(0, MAX_TIEN_ICH_SHOW),
			tienIchMore: Math.max(0, mappedTienIchList.length - MAX_TIEN_ICH_SHOW),
		};
	}, [phong, mappedTienIchList]);

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
					<span className='ktx-room-card__stat'>
						<DienTichIconCustom />
						&nbsp;
						{phong.dienTich}{intl.formatMessage({ id: 'kytucxa.dangky.card.m2' })}
					</span>
					<span className='ktx-room-card__dot' />
					<span className='ktx-room-card__stat'>
						<ExpandIconCustom />
						&nbsp;
						{phong.cachBoTri}
					</span>
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
						<Typography.Text strong className='ktx-room-card__price'>
							{formatGia(giaPhong, currency)}
						</Typography.Text>
					</div>
					<Button
						type='primary'
						disabled={slotLeft === 0 || phong.coTheDangKy === false || !!maPhongDaDangKy}
						className={`ktx-room-card__btn ${phong.ma === maPhongDaDangKy ? 'ktx-room-card__btn--registered' : ''}`}
						onClick={(e) => {
							e.stopPropagation();
							onDangKy(phong);
						}}
					>
						{phong.ma === maPhongDaDangKy ? intl.formatMessage({ id: 'kytucxa.dangky.card.registered' }) : intl.formatMessage({ id: 'kytucxa.dangky.card.register' })}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CardRoomKTX);