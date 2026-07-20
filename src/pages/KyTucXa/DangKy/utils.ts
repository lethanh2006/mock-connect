import { Phong } from '@/services/KyTucXa/Phong/typing';
import { getPublicAssetPath } from '@/utils/path';

export const ANH_PHONG_MAC_DINH = getPublicAssetPath('/metadata.png');

export const getAnhPhong = (phong?: Phong.IChinhSachPhongRecord) => {
	const danhSachAnh = phong?.danhSachAnh?.length ? phong.danhSachAnh : phong?.room?.danhSachAnh;

	return danhSachAnh?.map((item: any) => item?.url || item?.fileUrl || item).filter(Boolean) ?? [];
};

export const getAnhPhongHienThi = (phong?: Phong.IChinhSachPhongRecord) => {
	const danhSachAnh = getAnhPhong(phong);

	return danhSachAnh.length ? danhSachAnh : [ANH_PHONG_MAC_DINH];
};

export const getTenLoaiPhong = (phong: Phong.IChinhSachPhongRecord, intl: any) => {
	const room = phong.room;

	return (
		phong.loaiPhongKtx?.ten ||
		room?.loaiPhongKtx?.ten ||
		room?.danhSachTinhChatPhong?.find((item) => item.congNangChinh)?.loaiPhong?.loaiPhong ||
		phong.maLoaiPhongKtx ||
		room?.maLoaiPhongKtx ||
		intl.formatMessage({ id: 'kytucxa.dangky.card.chuaPhanLoai' })
	);
};

export const getTenPhong = (phong: Phong.IChinhSachPhongRecord, intl: any) => {
	const room = phong.room;
	const tenToaNha = room?.toaNha?.ten || room?.toaNha?.ma || room?.maToaNha;

	return [room?.ma || room?.soPhong, tenToaNha, getTenLoaiPhong(phong, intl)].filter(Boolean).join(' - ');
};

export const getSucChua = (phong?: Phong.IChinhSachPhongRecord) =>
	phong?.sucChua ?? phong?.room?.soLuongToiDa ?? phong?.room?.sucChua ?? 0;

export const getSoChoConLai = (phong?: Phong.IChinhSachPhongRecord) =>
	Math.max(0, getSucChua(phong) - (phong?.room?.soLuongHienTai ?? 0));

export const getDaHetCho = (phong?: Phong.IChinhSachPhongRecord) =>
	getSoChoConLai(phong) <= 0 || !phong?.room?.isChoThue || phong?.isChoPhepDangKy === false;

export const getTienIchPhong = (phong?: Phong.IChinhSachPhongRecord) =>
	phong?.danhSachTienIch?.length ? phong.danhSachTienIch : (phong?.room?.danhSachTienIch ?? []);

export const formatGiaPhong = (gia: number | null | undefined, donViTienTe: string | undefined, intl: any) =>
	gia
		? `${gia.toLocaleString('vi-VN')} ${donViTienTe || 'VND'}`
		: intl.formatMessage({ id: 'kytucxa.dangky.card.chuaCapNhat' });
