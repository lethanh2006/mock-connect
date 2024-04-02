import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
		responseType: 'arraybuffer',
	});
}

export async function getThongTinSinhVien() {
	return axios.get(`${ipDaoTao}/sinh-vien/me`);
}

export async function getTienTrinhDauRa(maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/chung-chi-sv/chung-chi-chuan-dau-ra/tien-trinh/me/khoa-nganh/${maKhoaNganh}`);
}

export async function getTrangThaiNoSinhVienMe(dotXetTotNghiepId: string) {
	return axios.get(`${ipDaoTao}/chuan-tot-nghiep/sinh-vien/me/dot/${dotXetTotNghiepId}`);
}

export async function getCanhBaoSinhVien(type: 'canh-bao-hoc-tap' | 'thoi-hoc') {
	return axios.get(`${ipDaoTao}/${type}/me`);
}

// GET MY KHOA NGANH

export async function getMyKhoaNganh() {
	return axios.get(`${ipDaoTao}/sinh-vien/me/khoa-nganh`);
}

export async function getMyLopHanhChinh() {
	return axios.get(`${ipDaoTao}/sinh-vien/me/lop-hanh-chinh`);
}

export const getThongTinSinhVienBySsoId = (ssoId: string) => axios.get(`${ipDaoTao}/sinh-vien/${ssoId}/info`);

//Chứng chỉ

export async function postChungChiSinhVien(payLoad: any) {
	return axios.post(`${ipDaoTao}/chung-chi-sv/sinh-vien/dang-ky`, payLoad);
}
