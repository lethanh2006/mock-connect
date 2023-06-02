import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';

export async function getDanhSachSinhVienByIdNhomLop(idNhomLop: string) {
  return axios.get(`${ip3}/lop-hoc-phan/${idNhomLop}/user/danh-sach-sv`);
}

export async function sinhVienGetLopTinChiByHocKy(idHocKy: string) {
  return axios.get(`${ip3}/lop-hoc-phan/sinh-vien/hoc-ky/${idHocKy}`);
}

// export async function giangVienGetLopTinChiByHocKy(idHocKy: string) {
//   return axios.get(`${ip3}/lop-hoc-phan/giang-vien/hoc-ky/${idHocKy}`);
// }

export async function sinhVienGetThoiKhoaBieu(idLop: string) {
  return axios.get(`${ipDaoTao}/lop-hoc-phan/${idLop}/sinh-vien/thoi-khoa-bieu`);
}

export async function getAllMonHocSinhVien(payload: { condition: { idHocKy?: number } }) {
  return axios.get(`${ip3}/odoo-slide-channel/sinh-vien/all`, { params: payload });
}

export async function sinhVienAllGetDiemTongKet() {
  return axios.get(`${ip3}/lop-hoc-phan/sinh-vien/me/all`);
}
