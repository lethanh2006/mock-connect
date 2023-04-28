// import { put } from '@/services/Setting/setting';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';

export async function getQuanLyOtoPageable(payload: {
  page: number;
  limit: number;
  condition: any;
}) {
  return axios.get(`${ip3}/quan-ly-oto`, { params: payload });
}

export async function postQuanLyOto(payload: any) {
  return axios.post(`${ip3}/quan-ly-oto`, payload);
}

export async function exportListXe(payload: any) {
  return axios.post(`${ip3}/quan-ly-oto/export-list-xe`, { listIdOto: payload });
}

export async function importListXe(payload: any) {
  const formData = buildFormData(payload);
  return axios.post(`${ip3}/quan-ly-oto/import-list-oto`, formData);
}

export async function putQuanLyOto(id: string, payload: any) {
  return axios.put(`${ip3}/quan-ly-oto/${id}`, payload);
}

export async function getQuanLyOtoAll() {
  return axios.get(`${ip3}/quan-ly-oto/all`);
}

export async function getQuanLyOtoById(id: string) {
  return axios.get(`${ip3}/quan-ly-oto/${id}/thong-tin`);
}

export async function deleteQuanLyOto(payload: any) {
  return axios.delete(`${ip3}/quan-ly-oto`, { data: payload });
}
