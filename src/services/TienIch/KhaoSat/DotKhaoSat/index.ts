import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';

// ĐÁNH GIÁ TIẾT HỌC
export async function getDotDanhGiaTietHoc(maHocKy: string) {
	return axios.get(`${ipDaoTao}/hoc-ky/${maHocKy}/dot-khao-sat-tiet-hoc`);
}

export async function getDotDanhGiaGiangVien(maHocKy: string) {
	return axios.get(`${ip3}/dot-khao-sat/danh-gia-giang-vien/hoc-ky/${maHocKy}`);
}

export async function getBieuMauPLOKhaoSat(maLopHocPhan: string, idDotKhaoSat: string) {
	return axios.post(`${ip3}/dot-khao-sat/lop-hoc-phan/${maLopHocPhan}/dot-khao-sat/${idDotKhaoSat}`);
}
