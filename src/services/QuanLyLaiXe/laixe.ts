import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getLaiXePageable(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/quan-ly-lai-xe`, { params: payload });
}

export async function getAllLaiXe() {
  return axios.get(`${ip3}/quan-ly-lai-xe/all`);
}

export async function postLaiXe(payload: any) {
  return axios.post(`${ip3}/quan-ly-lai-xe`, payload);
}

export async function putLaiXe(id: string, payload: any) {
  return axios.put(`${ip3}/quan-ly-lai-xe/${id}`, payload);
}

export async function deleteLaiXe(id: string) {
  return axios.delete(`${ip3}/quan-ly-lai-xe/${id}`);
}
