import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function sinhVienNopBai(payLoad: any) {
	return axios.post(`${ipDaoTao}/assignment-user/sinh-vien`, payLoad);
}
