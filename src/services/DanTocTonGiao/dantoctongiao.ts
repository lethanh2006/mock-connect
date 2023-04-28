import axios from '@/utils/axios';
import { ipCore } from '@/utils/ip';

export async function getDanToc() {
  return axios.get(`${ipCore}/dm-dan-toc/many`);
}

export async function getTonGiao() {
  return axios.get(`${ipCore}/dm-ton-giao/many`);
}
