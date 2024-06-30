import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { DeTaiKHCN } from '../DeTaiKHCN/typings';
import type { ELoaiHoiDongKHCN } from './constants';
import type { HoiDongKHCN } from './typings';

const url = 'hoi-dong-khcn';

export const updateKetQuaXetDuyet = (
	idHoiDong: string,
	payload: {
		bienBanUrl: string[];
		xetDuyet?: HoiDongKHCN.KetQuaDeTaiHoiDong[];
	},
) => {
	return axios.put(`${ip3}/${url}/${idHoiDong}/update-ket-qua`, payload);
};

export const guiMailThanhVienHoiDong = (idHoiDong: string) => {
	return axios.put(`${ip3}/${url}/${idHoiDong}/thanh-vien`);
};

export const diemDanh = (idHoiDong: string, payload: { danhSachThanhVien: DeTaiKHCN.ThanhVienDeTai[] }) => {
	return axios.put(`${ip3}/${url}/${idHoiDong}/diem-danh`, payload);
};

export const guiNhanXetDeTai = (
	idHoiDong: string,
	idDeTai: string,
	payload: {
		nhanXet: string;
		urlBienBan: string;
	},
) => {
	return axios.put(`${ip3}/${url}/${idHoiDong}/nhan-xet/de-tai/${idDeTai}`, payload);
};

export const giangVienGetNhanXetDeTai = (
	idHoiDong: string,
	idDeTai: string,
	payload: {
		page: number;
		limit: number;
		condition?: any;
	},
) => {
	return axios.get(`${ip3}/${url}/${idHoiDong}/nhan-xet/de-tai/${idDeTai}/me/pageable`, {
		params: payload,
	});
};

export const canBoGetNhanXetDeTai = (
	idHoiDong: string,
	idDeTai: string,
	payload: {
		page: number;
		limit: number;
		condition?: any;
	},
) => {
	return axios.get(`${ip3}/${url}/${idHoiDong}/nhan-xet/de-tai/${idDeTai}/can-bo/pageable`, {
		params: payload,
	});
};

export const canBoGetAllNhanXet = (idHoiDong: string, payload: { page: number; limit: number; condition?: any }) => {
	return axios.get(`${ip3}/${url}/${idHoiDong}/nhan-xet/pageable`, { params: payload });
};

export const ketThucHoiDong = (idHoiDong: string) => {
	return axios.put(`${ip3}/${url}/${idHoiDong}/ket-thuc`);
};

export const exportDSThanhVienHoiDong = (idHoiDong: string) => {
	return axios.get(`${ip3}/${url}/${idHoiDong}/thanh-vien/export`, { responseType: 'arraybuffer' });
};

export const exportQuyetDinhThanhLapHoiDong = (idHoiDong: string, loai: ELoaiHoiDongKHCN) => {
	return axios.get(`${ip3}/hoi-dong-khcn/${idHoiDong}/quyet-dinh-hd/export?loai=${loai}`, {
		responseType: 'arraybuffer',
	});
};
