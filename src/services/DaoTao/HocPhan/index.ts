import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getHocPhanDangKyTinChi() {
  return axios.get(`${ipDaoTao}/hoc-phan/du-lieu-nen/hoc-vien`);
}
