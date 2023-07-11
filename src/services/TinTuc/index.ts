import axios from '@/utils/axios';
import { ipNews } from '@/utils/ip';

export async function getTinTucStrapi(params: {
  apiArticleName: string;
  page: number;
  size: number;
}) {
  return axios.get(`${ipNews}/api/dynamic-content`, {
    params,
    headers: { Authorization: undefined },
  });
}

export async function getMultiTinTucStrapi(params: {
  listContentType: string[];
  page: number;
  size: number;
}) {
  return axios.get(`${ipNews}/api/dynamic-get-multi-content`, {
    params,
    headers: { Authorization: undefined },
  });
}

export async function getTinTucChiTietStrapi(params: { contentType: string; slug: string }) {
  return axios.get(`${ipNews}/api/dynamic-article-content`, {
    params,
    headers: { Authorization: undefined },
  });
}
