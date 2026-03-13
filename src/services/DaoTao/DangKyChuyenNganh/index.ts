import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getDotHienHanh() {
	return axios.get(`${ipDaoTao}/dang-ky-chuyen-nganh/dot/hien-hanh/my`);
}

export async function sinhVienDangKyChuyenNganh(data: any) {
	return axios.post(`${ipDaoTao}/dang-ky-chuyen-nganh/sinh-vien/dang-ky`, data);
}
