import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllChuDe(payload: { condition: any; idHinhThuc?: number }) {
  return axios.get(`${ip3}/common-topic/many`, { params: payload });
}
