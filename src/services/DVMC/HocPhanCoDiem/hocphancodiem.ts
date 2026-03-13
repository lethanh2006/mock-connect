import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function selectHocKy() {
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}

export async function selectHocPhan(payload: { idHocKy: string }) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/sinh-vien/hoc-ky`, { params: payload });
}
