import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getSoTinChiDangKy(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dk-vuot-tin-chi/so-tin-chi-dang-ky/${maHocKy}`);
}
