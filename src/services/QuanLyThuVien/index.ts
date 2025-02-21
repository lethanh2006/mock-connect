import { ip3, ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function nopTaiLieu(id: string, payLoad: any) {
	return axios.put(`${ipDaoTao}/quan-ly-la-lv-kl/${id}/nop`, payLoad);
}

export async function thongKeVaoRaThuVienMe() {
	return axios.get(`${ip3}/ql-thu-vien/thong-ke/me`);
}

export async function getSoLuotCheckInTop(params?: {
	thoiGianBatDau?: string;
	thoiGianKetThuc?: string;
	condition?: any;
	filters?: any[];
}) {
	return axios.get(`${ip3}/ql-thu-vien/top/so-luot-checkin`, {
		params,
	});
}
