import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getChuanDauRaMucTieu(deCuongId: string) {
	return axios.get(`${ipDaoTao}/chuan-dau-ra-muc-tieu-hoc-phan/chuong-trinh/me`, { params: { deCuongId } });
}
