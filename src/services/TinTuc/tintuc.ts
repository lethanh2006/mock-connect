import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { request } from 'umi';

export async function getDataTinTuc(options?: { [key: string]: any }) {
  return request<IRecordTinTuc.RootObject>(`${ip3}/tin-tuc/page`, {
    method: 'GET',
    params: { page: 1, limit: 20, ...(options || {}) },
  });
}

export async function getDetailTinTuc(id: any) {
  return axios.get(`${ip3}/tin-tuc/${id}`);
}
