import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function postSinhVienQuyDoiPhieu(idDotQuyDoi: string, payload: any) {
	return axios.post(`${ipDaoTao}/quy-doi-diem-sinh-vien/sinh-vien/dot/${idDotQuyDoi}/dang-ky`, payload);
}

export async function selectTruongHocDebounce(params: { condition?: any; key?: any; filter?: any[] }) {
	return axios.get(`${ipDaoTao}/quy-doi-diem-sinh-vien/distinct/minh-chung-cong-nhan`, { params });
}
