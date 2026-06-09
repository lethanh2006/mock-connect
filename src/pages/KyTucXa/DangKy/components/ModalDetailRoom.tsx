import { CheckCircleOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Image, Modal, Row, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { DienTichIconCustom } from './IconsRoom';
import { KyTucXa } from '@/services/KyTucXa/typings';
import './style.less';

interface RoomDetailModalProps {
	onDangKy: (phong: KyTucXa.IPhong) => void;
	maPhongDaDangKy?: string;
}

const formatGia = (gia?: number, currency?: string) => {
	if (!gia) return '---';
	return gia.toLocaleString('vi-VN') + ' ' + (currency || 'VND');
};

const AmenityIcon = ({ src, alt, className }: { src?: string; alt?: string; className?: string }) => {
	const [error, setError] = useState(false);

	if (!src || error) {
		return <CheckCircleOutlined className={className} />;
	}

	return (
		<img
			src={src}
			alt={alt}
			className={className}
			style={{ width: '1em', height: '1em', objectFit: 'contain' }}
			onError={() => setError(true)}
		/>
	);
};

const ModalDetailRoomKTX: React.FC<RoomDetailModalProps> = ({ onDangKy, maPhongDaDangKy }) => {
	const intl = useIntl();
	const { record: phong, isView, setIsView } = useModel('kytucxa.phong');
	const { danhSach: danhSachKhoanThu } = useModel('kytucxa.khoanthu');
	const { tienIchMap } = useModel('kytucxa.tienich');
	const [activeImg, setActiveImg] = useState<number>(0);

	const { slotLeft, numBedLabel, images, thumbs, tienIchAll } = useMemo(() => {
		if (!phong) return { slotLeft: 0, numBedLabel: '', images: [], thumbs: [], tienIchAll: [] };
		const left = Math.max(0, phong.soLuongToiDa - phong.soLuongHienTai);
		const imgs = phong.danhSachAnh ?? [];
		const tbs = imgs.slice(0, 4);
		const tienIchAll = (phong.danhSachTienIch ?? [])
			.map((it: KyTucXa.ITienIch) => {
				const key = it?.maDanhMucTienIch;
				const found = key ? tienIchMap.get(key) : undefined;
				if (found) return found;
				return { ten: it?.maDanhMucTienIch ?? '', anh: undefined };
			})
			.filter(Boolean);
		return {
			slotLeft: left,
			numBedLabel: `${intl.formatMessage({ id: 'kytucxa.dangky.card.bedRoom' }, { soLuongToiDa: phong.soLuongToiDa })}`,
			images: imgs,
			thumbs: tbs,
			tienIchAll,
		};
	}, [phong, tienIchMap]);

	const giaPhong = useMemo(() => {
		if (!phong) return undefined;
		const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
			(kt) => kt.maMucThu === phong.maKhoanThuPhong
		);
		return khoanThu?.unitAmount;
	}, [danhSachKhoanThu, phong?.maKhoanThuPhong]);

	const currency = useMemo(() => {
		if (!phong) return undefined;
		const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
			(kt) => kt.maMucThu === phong.maKhoanThuPhong
		);
		return khoanThu?.currency;
	}, [danhSachKhoanThu, phong?.maKhoanThuPhong]);

	if (!phong) return null;

	const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
	const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

	return (
		<Modal
			open={isView}
			onCancel={() => setIsView(false)}
			footer={null}
			width={975}
			destroyOnClose
			closeIcon={<CloseOutlined className='ktx-modal__close-icon' />}
			className='ktx-room-modal'
			title={intl.formatMessage({ id: 'kytucxa.dangky.modal.title' })}
		>
			<div className='ktx-modal__content'>
				<div className='ktx-modal__gallery-new'>
					<div className='ktx-modal__gallery-main'>
						{images.length > 0 ? (
							<Image.PreviewGroup
								items={images}
								preview={{
									current: activeImg,
									onChange: (index) => setActiveImg(index),
								}}
							>
								<Image
									src={images[activeImg] ?? images[0]}
									className='ktx-modal__main-img'
									wrapperClassName='ktx-modal__main-img-ant-wrap'
								/>
							</Image.PreviewGroup>
						) : (
							<div className='ktx-modal__main-img ktx-modal__main-img--placeholder' />
						)}

						{images.length > 1 && (
							<>
								<button className='ktx-modal__nav ktx-modal__nav--prev' onClick={prevImg}>
									<LeftOutlined />
								</button>
								<button className='ktx-modal__nav ktx-modal__nav--next' onClick={nextImg}>
									<RightOutlined />
								</button>
							</>
						)}

						{images.length > 1 && (
							<div className='ktx-modal__dots'>
								{images.map((_, i) => (
									<span
										key={i}
										className={`ktx-modal__dot-item${i === activeImg ? ' ktx-modal__dot-item--active' : ''}`}
										onClick={() => setActiveImg(i)}
									/>
								))}
							</div>
						)}
					</div>
					
					{thumbs.length > 1 && (
						<div className='ktx-modal__gallery-grid'>
							{thumbs.map((url, i) => (
								<div
									key={i}
									className={`ktx-modal__thumb${i === activeImg ? ' ktx-modal__thumb--active' : ''}`}
									onClick={() => setActiveImg(i)}
								>
									<img src={url} alt={`thumb-${i}`} />
								</div>
							))}
						</div>
					)}
				</div>

				<Row gutter={[24, 24]} className='ktx-modal__details-wrap'>
					<Col xs={24} md={15}>
						<div className='ktx-modal__title-row'>
							<Typography.Text strong className='ktx-modal__room-name'>
								{numBedLabel}
							</Typography.Text>
						</div>
						<div className='ktx-modal__sub-stats'>
							<span className='ktx-room-card__stat'>
								<DienTichIconCustom />
								&nbsp;
								{phong.dienTich}{intl.formatMessage({ id: 'kytucxa.dangky.card.m2' })}	
							</span>
						</div>

						<div className='ktx-modal__amenities-new'>
							{tienIchAll.map((t, i) => (
								<div key={i} className='ktx-modal__amenity-item'>
									<AmenityIcon src={('anh' in t) ? (t.anh as string) : undefined} alt={t.ten} className='ktx-modal__amenity-icon' />
									<span>{t.ten}</span>
								</div>
							))}
						</div>
					</Col>

					<Col xs={24} md={9}>
						<div className='ktx-modal__summary-card'>
							<div className='ktx-modal__summary-price'>
								{formatGia(giaPhong, currency)}
							</div>
							<div className='ktx-modal__info-grid-new'>
								<div className='ktx-modal__info-cell-new'>
									<span className='ktx-modal__info-label'>{intl.formatMessage({ id: 'kytucxa.dangky.modal.available' })}</span>
									<span className='ktx-modal__info-value' style={{ color: '#cc2424' }}>
										{slotLeft > 0 ? `${intl.formatMessage({ id: 'kytucxa.dangky.modal.slots' }, { slotLeft })}` : intl.formatMessage({ id: 'kytucxa.dangky.modal.outOfSlot' })}
									</span>
								</div>
								{/* <div className='ktx-modal__info-cell-new'>
									<span className='ktx-modal__info-label'>{intl.formatMessage({ id: 'kytucxa.dangky.modal.layout' })}</span>
									<span className='ktx-modal__info-value' style={{ color: '#2E2E2E' }}>
										{phong.cachBoTri ?? `${intl.formatMessage({ id: 'kytucxa.dangky.modal.people' }, { soLuongToiDa: phong.soLuongToiDa })}`}
									</span>
								</div> */}
							</div>
						</div>
					</Col>
				</Row>

				{phong.moTa && (
					<div className='ktx-modal__desc-new'>
						{phong.moTa}
					</div>
				)}

				{phong.coTheDangKy === false && phong.lyDoKhongTheDangKy?.length ? (
					<div className='ktx-modal__reason'>
						{phong.lyDoKhongTheDangKy.map((r, i) => (
							<div key={i} className='ktx-modal__reason-item'>
								• {r}
							</div>
						))}
					</div>
				) : null}

				<div className='ktx-modal__footer'>
					<Button size='large' onClick={() => setIsView(false)} className='ktx-modal__btn-close'>
						{intl.formatMessage({ id: 'kytucxa.dangky.modal.close' })}
					</Button>
					<Button
						type='primary'
						size='large'
						disabled={slotLeft === 0 || phong.coTheDangKy === false || !!maPhongDaDangKy}
						onClick={() => onDangKy(phong)}
						className={`ktx-modal__btn-register ${phong.ma === maPhongDaDangKy ? 'ktx-modal__btn-register--registered' : ''}`}
					>
						{phong.ma === maPhongDaDangKy ? intl.formatMessage({ id: 'kytucxa.dangky.modal.registered' }) : intl.formatMessage({ id: 'kytucxa.dangky.modal.register' })}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalDetailRoomKTX;