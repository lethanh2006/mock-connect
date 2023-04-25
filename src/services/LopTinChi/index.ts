import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getThongTinChungLopTinChiByIdLop(idLop: string) {
  return axios.get(`${ip3}/lop-hoc-phan/${idLop}/sinh-vien/gv-sv`);
}

export async function getAllSinhVien() {
  return axios.get(`${ip3}/lop-hoc-phan/sinh-vien/all`);
}

export async function getDanhSachSinhVienByIdNhomLop(idNhomLop: string) {
  return axios.get(`${ip3}/lop-hoc-phan/${idNhomLop}/user/danh-sach-sv`);
}
