import axios from '@/utils/axios';
import { ip3, keycloakClientID, keycloakTokenEndpoint } from '@/utils/ip';
import queryString from 'query-string';
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

export async function getInfo() {
  return axios.get(`${ip3}/user/me`);
}

export async function adminlogin(payload: { username?: string; password?: string }) {
  return axios.post(`${ip3}/auth/login`, { ...payload, platform: 'Web' });
}

export async function refreshAccesssToken(payload: { refreshToken: string }) {
  const data = {
    client_id: keycloakClientID,
    grant_type: 'refresh_token',
    refresh_token: payload.refreshToken,
  };

  return axios({
    url: keycloakTokenEndpoint,
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: queryString.stringify(data),
  });
}

export async function swapToken(payload: { access_token: string }) {
  const data = {
    audience: keycloakClientID,
    grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
  };

  return axios({
    url: keycloakTokenEndpoint,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${payload.access_token}`,
    },
    data: queryString.stringify(data),
  });
}
