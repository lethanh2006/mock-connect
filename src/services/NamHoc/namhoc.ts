import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllNamHoc() {
  return axios.get(`${ip3}/odoo-nam-hoc/all`);
}

export async function getAllNamHocSinhVien() {
  return axios.get(`${ip3}/odoo-nam-hoc/sinh-vien/all`);
}
