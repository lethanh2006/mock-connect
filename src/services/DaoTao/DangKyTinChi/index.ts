import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getDotAvailable(maHocKy: string) {
  return axios.get(`${ipDaoTao}/dang-ky-tin-chi/validate/hoc-ky/${maHocKy}`);
}

export async function getPhieuDangKy(maHocKy: string) {
  return axios.get(`${ipDaoTao}/dang-ky-tin-chi/phieu-dang-ky/hoc-ky/${maHocKy}`);
}

export async function postDangKyTinChi(data: {
  danhSachDangKy: { lopHocPhanId: string }[];
  phieuDktcId: string;
}) {
  return axios.post(`${ipDaoTao}/dang-ky-tin-chi/dang-ky/lop-hoc-phan`, data);
}

export async function deleteDangKyTinChi(data: { phieuDktcId: string; lopHocPhanId: string }) {
  return axios.delete(`${ipDaoTao}/dang-ky-tin-chi/dang-ky/lop-hoc-phan`, { data });
}
