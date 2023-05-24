import { ipCore } from '@/utils/ip';
import axios from 'axios';

export async function getQuanHuyen(maTinh: string) {
  return axios.get(`${ipCore}/don-vi-hanh-chinh/quan-huyen/maTinh/${maTinh}`);
}

export async function getTinhThanhPho() {
  return axios.get(`${ipCore}/don-vi-hanh-chinh/tinh`);
}

export async function getPhuongXa(maQH: string) {
  return axios.get(`${ipCore}/don-vi-hanh-chinh/xa-phuong/ma-quan-huyen/${maQH}`);
}
