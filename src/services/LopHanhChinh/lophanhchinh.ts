import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDataLopHanhChinh(role: string, idHinhThuc?: number) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/${role}/me`, { params: { idHinhThuc } });
}

export async function sinhVienGetLopHanhChinhPageable(payload: {
  page: number;
  limit: number;
  condition: any;
}) {
  return axios.get(`${ip3}/lop-hanh-chinh/sinh-vien/page`, { params: payload });
}

export async function sinhVienGetLopHanhChinhById(idLop: string) {
  return axios.get(`${ip3}/lop-hanh-chinh/${idLop}/sinh-vien`);
}
