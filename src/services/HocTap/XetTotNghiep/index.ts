import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getDotHienHanh() {
	return axios.get(`${ipDaoTao}/dot-xet-tot-nghiep/sinh-vien/dot-hien-hanh`);
}

export async function postDangKyXetTotNghiep(dotXetTotNghiepId: string) {
	return axios.post(`${ipDaoTao}/dot-xtn-sv/dang-ky/dot/${dotXetTotNghiepId}`);
}

export async function putYKienXetTotNghiep(
	sinhVienDotId: string,
	type: 'phan-hoi' | 'hoan',
	payload: { yKienSinhVien?: string },
) {
	return axios.put(`${ipDaoTao}/dot-xtn-sv/${sinhVienDotId}/${type}`, payload);
}
