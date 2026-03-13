import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDataLopHanhChinh(role: string, idHinhThuc?: number) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/${role}/me`, { params: { idHinhThuc } });
}
