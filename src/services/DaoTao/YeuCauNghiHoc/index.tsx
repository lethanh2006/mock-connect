import axios from 'axios';
import { ipDaoTao } from '@/utils/ip';

export const getMeByTenLop = (tenLopHocPhan: string, params?: any) => {
	const encodedTen = encodeURIComponent(tenLopHocPhan);
	const res = axios.get(`${ipDaoTao}/dang-ky-nghi-hoc/me/${encodedTen}`, { params });
	return res;
};

export const huyDonXinNghi = (id: string) => {
	const res = axios.delete(`${ipDaoTao}/dang-ky-nghi-hoc/huy/${id}`);
	return res;
};
