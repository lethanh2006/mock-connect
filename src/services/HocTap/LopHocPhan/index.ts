import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getDiemLopHocPhan(lopHocPhanId: string) {
  return axios.get(`${ipDaoTao}/lop-hoc-phan/sinh-vien/diem-so-lop-hoc-phan/${lopHocPhanId}`);
}

export async function getAllDiemLopHocPhan() {
  return axios.get(`${ipDaoTao}/lop-hp-sv/sinh-vien/all`);
}
