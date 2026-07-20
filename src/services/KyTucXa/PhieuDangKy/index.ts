import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';

export async function sinhVienDangKyKTX(payLoad: any) {
	return axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/me`, payLoad);
}
