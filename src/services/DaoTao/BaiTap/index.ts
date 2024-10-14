import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function sinhVienNopBai(payLoad: any) {
	return axios.post(`${ipDaoTao}/assignment-user/sinh-vien`, payLoad);
}

export async function thongKeBaiTap(startDate: any, endDate: any) {
	return axios.get(`${ipDaoTao}/assignment/lich/sinh-vien/from/${startDate}/to/${endDate}`);
}
