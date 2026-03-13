import axios from '@/utils/axios';

import { ip3 } from '@/utils/ip';
import type { ELoaiHoiDongKHCN } from '../HoiDongKHCN/constants';
import type { EPhaseDeTaiKHCN, ETrangThaiDeTaiQuanLyKhoaHoc } from './constants';
import type { DeTaiKHCN } from './typings';

const url = 'de-tai-khcn';

export const chuyenVienTiepNhanDeTai = (
	idDeTai: string,
	path: 'moi' | 'chinh-sua',
	payload: {
		trangThaiDangKy: ETrangThaiDeTaiQuanLyKhoaHoc;
		comment: string;
	},
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/dang-ky/${path}/${idDeTai}`, payload);
};

export const chuyenVienTiepNhanDeCuong = (
	idDeTai: string,
	path: 'moi' | 'chinh-sua',
	payload: {
		trangThaiNopDeCuong: ETrangThaiDeTaiQuanLyKhoaHoc;
		comment: string;
	},
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/nop-de-cuong/${path}/${idDeTai}`, payload);
};

export const chuyenVienTiepNhanThucHien = (
	idDeTai: string,
	path: 'moi' | 'chinh-sua',
	payload: {
		trangThaiThucHien: ETrangThaiDeTaiQuanLyKhoaHoc;
		comment: string;
	},
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/thuc-hien/${path}/${idDeTai}`, payload);
};

export const chuyenVienResetTrangThaiChuaTiepNhan = (idDeTai: string, phaDeTai: EPhaseDeTaiKHCN) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/dang-ky/reset-status/${idDeTai}?phaDeTai=${phaDeTai}`);
};

export const chuyenVienKhoaOrMoKhoaDeTai = (type: 'lock' | 'unlock', idDeTai: string, phaDeTai: EPhaseDeTaiKHCN) => {
	return axios.put(`${ip3}/${url}/${type}/${idDeTai}?phaDeTai=${phaDeTai}`);
};

export const giangVienKhoaOrMoKhoaDeTai = (type: 'lock' | 'unlock', idDeTai: string, phaDeTai: EPhaseDeTaiKHCN) => {
	return axios.put(`${ip3}/${url}/me/${type}/${idDeTai}?phaDeTai=${phaDeTai}`);
};

export const lockDeCuong2022 = (idDeTai: string) => {
	return axios.put(`${ip3}/${url}/de-cuong-2022/lock/de-tai/${idDeTai}`);
};

export const getDeTaiNgoaiHoiDong = (
	payload: { loaiHoiDongKhcn: ELoaiHoiDongKHCN; condition?: any },
	idDotDangKy: string,
) => {
	return axios.get(`${ip3}/${url}/ngoai-hoi-dong/all/dot-dang-ky/${idDotDangKy}`, {
		params: payload,
	});
};

export const chuyenVienTiepNhanDeTaiSauHoiDong = (
	idDeTai: string,
	payload: { trangThaiXetDuyet: ETrangThaiDeTaiQuanLyKhoaHoc; comment: string },
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/xet-duyet/chinh-sua/${idDeTai}`, payload);
};

export const chuyenVienTiepNhanDeCuongSauHoiDong = (
	idDeTai: string,
	payload: { deCuongKhcn: DeTaiKHCN.ThuyetMinh },
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/de-cuong/chinh-sua/${idDeTai}`, payload);
};

export const chuyenVienNghiemThuDeTaiSauHoiDong = (
	idDeTai: string,
	payload: { nghiemThuKhcn: DeTaiKHCN.NghiemThu },
) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/nghiem-thu/chinh-sua/${idDeTai}`, payload);
};

export const importQuyetDinhGiao = (
	idDeTai: string,
	payload: {
		quyetDinhGiaoUrl: string;
		commentQuyetDinhGiaoUrl: string;
	},
) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/import-quyet-dinh-giao`, payload);
};

export const exportQuyetDinhGiao = (idDeTai: string) => {
	return axios.get(`${ip3}/${url}/quyet-dinh-giao/de-tai/${idDeTai}`, {
		responseType: 'arraybuffer',
	});
};

export const giangVienPutDangKyDeXuat = (idDeTai: string, payload: { dangKyKhcn: DeTaiKHCN.DangKyDeXuat }) => {
	return axios.put(`${ip3}/${url}/me/${idDeTai}/dang-ky`, payload);
};

export const chuyenVienPutDeCuong = (idDeTai: string, payload: { deCuongKhcn: DeTaiKHCN.ThuyetMinh }) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/de-cuong`, payload);
};

export const chuyenVienPutNghiemThu = (idDeTai: string, payload: { nghiemThuKhcn: DeTaiKHCN.NghiemThu }) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/nghiem-thu`, payload);
};

export const giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThu = (
	idDeTai: string,
	payload: {
		dangKyKhcn?: DeTaiKHCN.DangKyDeXuat;
		deCuongKhcn?: DeTaiKHCN.ThuyetMinh;
		nghiemThuKhcn?: DeTaiKHCN.NghiemThu;
	},
	path: 'xet-duyet' | 'de-cuong' | 'nghiem-thu',
) => {
	return axios.put(`${ip3}/${url}/me/${idDeTai}/${path}`, payload);
};

export const exportDeTaiById = (idDeTai: string) => {
	return axios.get(`${ip3}/${url}/${idDeTai}/export`, {
		responseType: 'arraybuffer',
	});
};

export const exportAllDeTaiByTrangThai = (payload: { condition?: any }) => {
	return axios.get(`${ip3}/${url}/export/all`, {
		params: payload,
		responseType: 'arraybuffer',
	});
};

export const searchDeTaiTheoTen = (text: string) => {
	return axios.get(`${ip3}/${url}/search/ten/${text}`);
};

export const exportAllQuyetDinhGiaoByDotByMaDonVi = (idDot: string, maDonVi: string) => {
	return axios.get(`${ip3}/${url}/quyet-dinh-giao/dot-dang-ky/${idDot}/don-vi/${maDonVi}`, {
		responseType: 'arraybuffer',
	});
};

export const canBoGiangVienUpdateDeCuong = (
	idDeTai: string,
	payload: {
		deCuongKhcn: DeTaiKHCN.ThuyetMinh;
	},
) => {
	return axios.put(`${ip3}/${url}/me/${idDeTai}/de-cuong`, payload);
};

export const canBoGiangVienUpdateNghiemThu = (
	idDeTai: string,
	payload: {
		nghiemThuKhcn: DeTaiKHCN.NghiemThu;
	},
) => {
	return axios.put(`${ip3}/${url}/me/${idDeTai}/nghiem-thu`, payload);
};

export const canBoGiangVienLockThucHienDeTai = (idDeTai: string) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/thuc-hien/me`);
};

export const chuyenVienUnlockThucHienDeTai = (idDeTai: string) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/thuc-hien/revert`);
};

export const exportBangTongHopDangKyDeTaiNhomAB = (
	idDot: string,
	loaiExport: 'Đơn vị cá nhân' | 'Toàn học viện',
	trangThaiDangKy?: ETrangThaiDeTaiQuanLyKhoaHoc | 'all',
	donViIds?: string[],
) => {
	return axios.get(
		`${ip3}/${url}/a-b/export/excel/dot-dang-ky/${idDot}?loaiExport=${loaiExport}${
			trangThaiDangKy ? `&trangThaiDangKy=${trangThaiDangKy}` : ''
		}${donViIds?.length ? `&donViIds=${donViIds}` : ''}`,
		{
			responseType: 'arraybuffer',
		},
	);
};

export const giangVienNopKetQuaSauNghiemThu = (
	idDeTai: string,
	payload: {
		ketQua: DeTaiKHCN.TaiLieu[];
	},
) => {
	return axios.put(`${ip3}/${url}/me/${idDeTai}/sau-nghiem-thu`, payload);
};

export const canBoNopKetQuaSauNghiemThu = (
	idDeTai: string,
	payload: {
		ketQua: DeTaiKHCN.TaiLieu[];
	},
) => {
	return axios.put(`${ip3}/${url}/${idDeTai}/sau-nghiem-thu`, payload);
};

export const canBoDuyetHoanThanhDeTai = (idDeTai: string) => {
	return axios.put(`${ip3}/${url}/tiep-nhan/sau-nghiem-thu/hoan-thanh/${idDeTai}`);
};

export const giangVienUploadDeCuong = (
	idDeTai: string,
	payload: {
		scanDeCuong: string;
		hopDong: string;
	},
) => {
	return axios.put(`${ip3}/${url}/de-cuong-2022/de-tai/${idDeTai}`, payload);
};

export const exportDeXuatUngDung = (
	idDeTai: string,
	payload: {
		exportType: 'pdf' | 'word';
	},
) =>
	axios.get(`${ip3}/de-tai-khcn/export/de-xuat-ung-dung/de-tai/${idDeTai}`, {
		responseType: 'arraybuffer',
		params: payload,
	});
