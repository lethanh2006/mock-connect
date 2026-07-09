import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';
import { pick } from 'lodash';
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
export async function getCauTraLoiMe(idKhaoSat: string, idDot: string, params?: { condition?: any; filter?: any[] }) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/me/khao-sat/${idKhaoSat}/dot/${idDot}`, { params });
}
export async function getCauTraLoiMeTracNghiem(payLoad: any) {
	return axios.post(`${ip3}/cau-tra-loi-khao-sat/trac-nghiem/initialize/answer/khao-sat`, payLoad);
}

export async function getCauTraLoiMeBaiTap(idCauTraLoi: string) {
	return axios.get(`${ip3}/cau-tra-loi-khao-sat/${idCauTraLoi}`);
}

// ĐÁNH GIÁ GIẢNG VIÊN
export async function danhGiaGiangVien(payload: any) {
	return axios.post(`${ip3}/danh-gia-giang-vien/me`, payload);
}

export async function getDanhGiaGiangVien(lopHocPhanId: string) {
	return axios.get(`${ip3}/danh-gia-giang-vien/lop-hoc-phan/${lopHocPhanId}`);
}

const CAU_TRA_LOI_FIELDS = ['danhSachTraLoi', 'idDot', 'idKhaoSat'] as const;

// ĐÁNH GIÁ TIẾT HỌC
export async function danhGiaTietHoc(payload: Partial<BieuMau.TPostDanhGiaTietHoc>) {
	const { idTkb, cauTraLoi } = payload;
	return axios.post(`${ipDaoTao}/lop-hoc-phan/tkb/sinh-vien/danh-gia`, {
		idTkb,
		cauTraLoi: pick(cauTraLoi, CAU_TRA_LOI_FIELDS),
	});
}

export async function getDanhGiaTietHoc(thoiKhoaBieuId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/tkb/${thoiKhoaBieuId}/sinh-vien/danh-gia`);
}

export async function getBieuMauKhaoSatSinhVien(idKhaoSat: string | number) {
	return axios.get(`${ip3}/khao-sat/${idKhaoSat}/nguoi-dung-khao-sat`);
}
