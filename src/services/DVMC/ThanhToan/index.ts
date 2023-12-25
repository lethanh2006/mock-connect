import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function thongKeMyInvoice(payload: { condition: any }) {
  return axios.get(`${ipTaiChinh}/chi-tiet-thu/thong-ke/cong-no/me`, {
    params: payload,
  });
}

export async function getInvoiceByIdentityCode(identityCode: string) {
  return axios.get(`${ipTaiChinh}/chi-tiet-thu/ma-hoa-don/${identityCode}`);
}
