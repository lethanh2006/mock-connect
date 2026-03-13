import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function traLoiPhanHoi(payload: { id: string; data: { noiDungTraLoi: string } }) {
  return axios.post(`${ip3}/phan-hoi/${payload.id}/tra-loi`, payload.data);
}

export async function getPhanHoiUser(payload: {
  page: number;
  limit: number;
  condition: { daTraLoi?: boolean };
}) {
  return axios.get(`${ip3}/phan-hoi/me/pageable`, { params: payload });
}
