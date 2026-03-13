import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function sinhVienNopBai(payLoad: any) {
	return axios.post(`${ipDaoTao}/assignment-user/sinh-vien`, payLoad);
}

export async function thongKeBaiTap(startDate: any, endDate: any) {
	return axios.get(`${ipDaoTao}/assignment/lich/sinh-vien/from/${startDate}/to/${endDate}`);
}

export async function getThongKeBaiTapSinhVien(maHocKy: string) {
	return axios.get(`${ipDaoTao}/assignment-user/hoc-ky/${maHocKy}/sinh-vien/me/thong-ke`);
}
