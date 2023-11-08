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

export async function getTienTrinhDauRa() {
	return axios.get(`${ipDaoTao}/chung-chi-sv/chung-chi-chuan-dau-ra/tien-trinh/me`);
}

export async function getTrangThaiNoSinhVienMe(dotXetTotNghiepId: string) {
	return axios.get(`${ipDaoTao}/chuan-tot-nghiep/sinh-vien/me/dot/${dotXetTotNghiepId}`);
}

export async function getCanhBaoSinhVien(type: 'canh-bao-hoc-tap' | 'thoi-hoc') {
	return axios.get(`${ipDaoTao}/${type}/me`);
}
