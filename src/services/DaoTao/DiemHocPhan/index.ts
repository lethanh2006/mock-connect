import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getHocPhanDangKyTinChi(maHocKy: string) {
  return axios.get(`${ipDaoTao}/diem-hoc-phan/hoc-phan-dang-ky/hoc-ky/${maHocKy}`);
}
