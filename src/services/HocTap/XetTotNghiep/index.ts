import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function postDangKyXetTotNghiep(dotXetTotNghiepId: string) {
	return axios.post(`${ipDaoTao}/dot-xtn-sv/dang-ky/dot/${dotXetTotNghiepId}`);
}

export async function putDangKyHoanTotNghiep(sinhVienDotId: string, payload: { yKienSinhVien?: string }) {
	return axios.put(`${ipDaoTao}/dot-xtn-sv/${sinhVienDotId}/hoan`, payload);
}

export async function putPhanHoiXetTotNghiep(sinhVienDotId: string, payload: { yKienSinhVien?: string }) {
	return axios.put(`${ipDaoTao}/dot-xtn-sv/${sinhVienDotId}/phan-hoi`, payload);
}
