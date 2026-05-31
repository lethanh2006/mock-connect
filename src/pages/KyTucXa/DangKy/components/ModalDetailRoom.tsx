import { CheckCircleOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Image, Modal, Row, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { DienTichIconCustom } from './IconsRoom';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';
import './style.less';

interface RoomDetailModalProps {
	onDangKy: (phong: DangKyKyTucXa.IPhongKTXSinhVien) => void;
	maPhongDaDangKy?: string;
}

const formatGia = (gia?: number, currency?: string) => {
	if (!gia) return '---';
	return gia.toLocaleString('vi-VN') + ' ' + (currency || 'VND');
};

const splitTwoCol = <T,>(arr: T[]): [T[], T[]] => {
	const mid = Math.ceil(arr.length / 2);
	return [arr.slice(0, mid), arr.slice(mid)];
};

const ModalDetailRoomKTX: React.FC<RoomDetailModalProps> = ({ onDangKy, maPhongDaDangKy }) => {
	const intl = useIntl();
	const { record: phong, isView, setIsView } = useModel('kytucxa.phong');
	const { danhSach: danhSachKhoanThu } = useModel('kytucxa.khoanthu');
	const { tienIchMap } = useModel('kytucxa.tienich');
	const [activeImg, setActiveImg] = useState<number>(0);

	const { slotLeft, numBedLabel, images, thumbs, col1, col2 } = useMemo(() => {
		if (!phong) return { slotLeft: 0, numBedLabel: '', images: [], thumbs: [], col1: [], col2: [] };
		const left = Math.max(0, phong.soLuongToiDa - phong.soLuongHienTai);
		const imgs = phong.danhSachAnh ?? [];
		const tbs = imgs.slice(0, 4);
		const tienIchAll = (phong.danhSachTienIch ?? [])
			.map((it: DangKyKyTucXa.ITienIchKTX) => {
				const key = it?.maDanhMucTienIch;
				const found = key ? tienIchMap.get(key) : undefined;
				if (found) return found;
				return { ten: it?.maDanhMucTienIch ?? '' };
			})
			.filter(Boolean);
		const [c1, c2] = splitTwoCol(tienIchAll);
		return {
			slotLeft: left,
			numBedLabel: `${intl.formatMessage({ id: 'kytucxa.dangky.card.bedRoom' }, { soLuongToiDa: phong.soLuongToiDa })}`,
			images: imgs,
			thumbs: tbs,
			col1: c1,
			col2: c2,
		};
	}, [phong, tienIchMap]);

	const giaPhong = useMemo(() => {
		if (!phong) return undefined;
		const khoanThu = (danhSachKhoanThu as DangKyKyTucXa.IKhoanThuKTX[])?.find(
			(kt) => kt.maMucThu === phong.maKhoanThuPhong
		);
		return khoanThu?.unitAmount;
	}, [danhSachKhoanThu, phong?.maKhoanThuPhong]);

	const currency = useMemo(() => {
		if (!phong) return undefined;
		const khoanThu = (danhSachKhoanThu as DangKyKyTucXa.IKhoanThuKTX[])?.find(
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
			width={1000}
			destroyOnClose
			closeIcon={<CloseOutlined className='ktx-modal__close-icon' />}
			className='ktx-room-modal'
			title={intl.formatMessage({ id: 'kytucxa.dangky.modal.title' })}
		>
			<div className='ktx-modal__content'>
				<Row justify='space-between' align='middle' gutter={[16, 8]}>
					<Col style={{ paddingLeft: 20 }}>
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
					</Col>
					<Col className='ktx-modal__price-col'>
						<Typography.Text strong className='ktx-modal__price'>
							{formatGia(giaPhong, currency)}
						</Typography.Text>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
					<Col xs={24} md={14}>
						<div className='ktx-modal__gallery' style={{ display: 'flex', gap: 12, height: 300 }}>
							<div className='ktx-modal__main-img-wrap' style={{ flex: 1, height: '100%', paddingTop: 0 }}>
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
								<div className='ktx-modal__thumbs' style={{ width: 70, marginBottom: 0 }}>
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
					</Col>

					<Col xs={24} md={10}>
						<div className='ktx-modal__info-grid'>
							<div className='ktx-modal__info-cell'>
								<span className='ktx-modal__info-label'>{intl.formatMessage({ id: 'kytucxa.dangky.modal.available' })}</span>
								<span className='ktx-modal__info-value' style={{ color: '#cc2424' }}>
									{slotLeft > 0 ? `${intl.formatMessage({ id: 'kytucxa.dangky.modal.slots' }, { slotLeft })}` : intl.formatMessage({ id: 'kytucxa.dangky.modal.outOfSlot' })}
								</span>
							</div>
							<div className='ktx-modal__info-cell'>
								<span className='ktx-modal__info-label'>{intl.formatMessage({ id: 'kytucxa.dangky.modal.layout' })}</span>
								<span className='ktx-modal__info-value' style={{ color: '#2E2E2E' }}>
									{phong.cachBoTri ?? `${intl.formatMessage({ id: 'kytucxa.dangky.modal.people' }, { soLuongToiDa: phong.soLuongToiDa })}`}
								</span>
							</div>
						</div>

						<Row gutter={[8, 4]} className='ktx-modal__amenities'>
							<Col span={12}>
								{col1.map((t, i) => (
									<div key={i} className='ktx-modal__amenity-item'>
										<CheckCircleOutlined className='ktx-modal__amenity-icon' />
										<span>{t.ten}</span>
									</div>
								))}
							</Col>
							<Col span={12}>
								{col2.map((t, i) => (
									<div key={i} className='ktx-modal__amenity-item'>
										<CheckCircleOutlined className='ktx-modal__amenity-icon' />
										<span>{t.ten}</span>
									</div>
								))}
							</Col>
						</Row>
					</Col>
				</Row>

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