import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getDiemLopHocPhan(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/sinh-vien/diem-so-lop-hoc-phan/${lopHocPhanId}`);
}

export async function getMoodleLopHocPhan(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/${lopHocPhanId}/moodle/course`);
}

export async function getGiaoAnSinhVien(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hoc-phan/${lopHocPhanId}/giao-an/sinh-vien`);
}

export async function thongKeDiemPLOSinhVien(maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/diem-hp-sv-hk/thong-ke-diem-pi/me/khoa-nganh/${maKhoaNganh}`);
}

export async function thongTinWithdraw(lopHocPhanId: string) {
	return axios.get(`${ipDaoTao}/lop-hp-sv/thong-tin-rut-lop-hp/${lopHocPhanId}`);
}

export async function postWithdraw(payLoad: any) {
	return axios.post(`${ipDaoTao}/lop-hp-sv/rut-lop-hp`, payLoad);
}


