import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function nhucauhocphan(payLoad: any) {
	return axios.post(`${ipDaoTao}/hoc-phan-sinh-vien-dang-ky-nhu-cau/dang-ky`, payLoad);
}
