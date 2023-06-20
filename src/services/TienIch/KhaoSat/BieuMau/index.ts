import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type ELoaiBieuMau } from '../constants';
import { type BieuMau } from './typing';

export async function getIdBieuMauDaTraLoi(loaiBieuMau?: ELoaiBieuMau) {
  return axios.get(`${ip3}/cau-tra-loi-bieu-mau/id-bieu-mau/da-tra-loi?loai=${loaiBieuMau}`);
}

export async function traLoiBieuMau(payload: {
  idBieuMau: string;
  danhSachTraLoi: BieuMau.TraLoiRecord[];
  idDot: string;
}) {
  return axios.post(`${ip3}/cau-tra-loi-bieu-mau/me`, payload);
}

export async function initBieuMauTracNghiem(payload: { idKhaoSat: string; idDot: string }) {
  return axios.post(
    `${ip3}/cau-tra-loi-bieu-mau/trac-nghiem/initialize/answer/khao-sat/${payload.idKhaoSat}`,
    payload,
  );
}
