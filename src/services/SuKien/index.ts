import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type ELoaiSuKien } from './constant';

const url = 'su-kien/user';

export async function getSuKienTrongKhoang(payload: {
  fromDate: string;
  toDate: string;
  types?: ELoaiSuKien[];
}) {
  return axios.get(`${ip3}/${url}/from/${payload.fromDate}/to/${payload.toDate}`, {
    params: { types: payload.types?.join(',') },
  });
}
