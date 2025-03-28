import axios from 'axios';
import type { ETrangThaiSanPham } from './constants';
import { ip3 } from '@/utils/ip';
import type { SanPhamNCKH } from './typings';
import type { LoaiHinhNCKH } from '../LoaiHinhNCKH/typings';

const url = 'nckh/san-pham-nckh';

export const tiepNhanSanPhamNCKH = (
	idSanPhamNCKH: string,
	payload: {
		ketQuaTiepNhan: ETrangThaiSanPham;
		ghiChuTiepNhan?: string;
	},
) => axios.put(`${ip3}/${url}/${idSanPhamNCKH}/tiep-nhan`, payload);

export const putQuyDoiGioSanPhamNCKH = (
	idSanPhamNCKH: string,
	payload: {
		namHocId: string;
		danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[];
	},
	mode: 'GIO' | 'DIEM',
) => axios.put(`${ip3}/${url}/${idSanPhamNCKH}/quy-doi-gio?mode=${mode}`, payload);

export const getQuyDoiGioTheoCongThuc = (
	namHocId: string,
	mode: 'GIO' | 'DIEM',
	payload: {
		danhSachThanhVien: SanPhamNCKH.ThanhVienNCKH[];
		thongTinKhaiBao: LoaiHinhNCKH.TruongThongTin[];
		soLuongThanhVien: number;
		thongTinThoiGian: SanPhamNCKH.TimeConfig;
		loaiHinhNckhId: string;
	},
) => axios.post(`${ip3}/${url}/gio-quy-doi-theo-cong-thuc?namHocId=${namHocId}&mode=${mode}`, payload);

export const putService = (id: string | number, payload: any) => {
	return axios.put(`${ip3}/${url}/${id}/update/user`, payload);
};

export const deleteService = (id: string | number, silent?: boolean) => {
	return axios.delete(`${ip3}/${url}/${id}/delete/user`, { data: { silent } });
};

export const searchSanPham = (textQuery: string) => {
	return axios.get(`${ip3}/${url}/search?textQuery=${textQuery}`);
};

export const putSanPhamSauDuyet = (idSanPham: string, payload: any) =>
	axios.put(`${ip3}/${url}/${idSanPham}/update/user/sau-duyet`, payload);

export const exportSanPham = (payload: { condition?: any; filters: any[] }) => {
	return axios.get(`${ip3}/${url}/export`, { responseType: 'arraybuffer', params: payload });
};

export const xacNhanHoanThanh = (idSanPham: string, payload: SanPhamNCKH.IRecord) =>
	axios.put(`${ip3}/${url}/${idSanPham}/hoan-thanh/user`, payload);

export const chuyenDotSanPham = (idSanPham: string, idDot: string) =>
	axios.put(`${ip3}/${url}/${idSanPham}/dot/${idDot}`);
