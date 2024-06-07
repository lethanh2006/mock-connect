import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';
import { type ELoaiBieuMau } from '../constants';
import { type BieuMau } from './typing';

export async function getIdBieuMauDaTraLoi(loaiBieuMau?: ELoaiBieuMau) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/id-khao-sat/da-tra-loi?loai=${loaiBieuMau}`);
}

export async function traLoiBieuMau(payload: {
	idKhaoSat: string;
	danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]>;
	idDot: string;
}) {
	return axios.post(`${ip3}/cau-tra-loi-khao-sat/me`, payload);
}

export async function initBieuMauTracNghiem(payload: { idKhaoSat: string; idDot: string }) {
	return axios.post(`${ip3}/cau-tra-loi-khao-sat/trac-nghiem/initialize/answer/khao-sat/${payload.idKhaoSat}`, payload);
}
export async function getCauTraLoiMe(idKhaoSat: string, idDot: string) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/me/khao-sat/${idKhaoSat}/dot/${idDot}`);
}

// ĐÁNH GIÁ GIẢNG VIÊN
export async function danhGiaGiangVien(payload: any) {
	return axios.post(`${ip3}/danh-gia-giang-vien/me`, payload);
}

export async function getDanhGiaGiangVien(lopHocPhanId: string) {
	return axios.get(`${ip3}/danh-gia-giang-vien/lop-hoc-phan/${lopHocPhanId}`);
}

// ĐÁNH GIÁ TIẾT HỌC
export async function danhGiaTietHoc(payload: any) {
	return axios.post(`${ipDaoTao}/lop-hoc-phan/tkb/sinh-vien/danh-gia`, payload);
}

export async function getDanhGiaTietHoc(thoiKhoaBieuId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/tkb/${thoiKhoaBieuId}/sinh-vien/danh-gia`);
}
