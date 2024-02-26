import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

// ĐÁNH GIÁ TIẾT HỌC
export async function getDotDanhGiaTietHoc(maHocKy: string) {
	return axios.get(`${ipDaoTao}/hoc-ky/${maHocKy}/dot-khao-sat-tiet-hoc`);
}
