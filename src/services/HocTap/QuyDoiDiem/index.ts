import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function postSinhVienQuyDoi(idDotQuyDoi: string, payload: any) {
	return axios.post(`${ipDaoTao}/quy-doi-diem-sinh-vien/dot/${idDotQuyDoi}`, payload);
}

export async function postSinhVienQuyDoiPhieu(idDotQuyDoi: string, payload: any) {
	return axios.post(`${ipDaoTao}/quy-doi-diem-sinh-vien/sinh-vien/dot/${idDotQuyDoi}/dang-ky`, payload);
}
