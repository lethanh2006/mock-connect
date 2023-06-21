import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'su-kien/user';

export async function getSuKienTrongKhoang(payload: { fromDate: string; toDate: string }) {
  return axios.get(`${ip3}/${url}/from/${payload.fromDate}/to/${payload.toDate}`);
}
