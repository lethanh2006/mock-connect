import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

const url = 'thoi-khoa-bieu/sv';

export async function getThoiKhoaBieuById(idThoiKhoaBieu: string) {
  return axios.get(`${ipDaoTao}/${url}/${idThoiKhoaBieu}`);
}

export async function getThoiKhoaBieuByTrongKhoang(payload: { fromDate: string; toDate: string }) {
  return axios.get(`${ipDaoTao}/${url}/from/${payload.fromDate}/to/${payload.toDate}`);
}
