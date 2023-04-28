import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function userGetAllBieuMau(payload: { condition: any }) {
  return axios.get(`${ip3}/dvmc/me/all`, { params: payload });
}
