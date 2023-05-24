/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { DichVuMotCuaV2 } from './typing';

export async function getBieuMauAdmin(payload: { condition: any; page: number; limit: number }) {
  return axios.get(`${ip3}/dvmc/pageable`, { params: payload });
}

export async function getDonSinhVien(payload: { condition: any; page: number; limit: number }) {
  return axios.get(`${ip3}/don-dvmc/my/pageable`, {
    params: {
      ...payload,
      sort: {
        createdAt: -1,
      },
    },
  });
}

export async function userGetAllBieuMau(payload: { condition: any }) {
  return axios.get(`${ip3}/dvmc/me/all`, { params: payload });
}

export async function postDonSinhVien(payload: {
  duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
  dichVuId: string;
}) {
  return axios.post(`${ip3}/don-dvmc/my`, payload);
}

export async function sinhVienGetTrangThaiDon(idDon: string, payload: { condition: any }) {
  return axios.get(`${ip3}/don-dvmc/sinh-vien/me/don-dvmc/${idDon}/buoc`, { params: payload });
}

export async function getBieuMauById(idBieuMau: string) {
  return axios.get(`${ip3}/dvmc/${idBieuMau}`);
}

export async function traKetQua(
  idDon: string,
  payload: {
    ketQuaText: string;
    ketQuaDinhKem: string[];
  },
) {
  return axios.put(`${ip3}/don-dvmc/ket-qua/${idDon}`, payload);
}

export async function downloadDon(payload: { idDon: string; mauExport: 'MAU_DON' | 'TRA_LOI' }) {
  return axios.get(
    `${ip3}/don-dvmc/${payload.idDon}/export/word/?mauExport=${payload.mauExport}&exportType=word`,
    {
      responseType: 'arraybuffer',
    },
  );
}

export async function printDon(payload: { idDon: string; mauExport: 'MAU_DON' | 'TRA_LOI' }) {
  return axios.get(
    `${ip3}/don-dvmc/${payload.idDon}/export/word/?mauExport=${payload.mauExport}&exportType=pdf`,
  );
}

export async function sinhVienDeleteDon(idDon: string) {
  return axios.delete(`${ip3}/don-dvmc/my/${idDon}`);
}

export async function sinhVienPutDon(
  idDon: string,
  payload: { duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] },
) {
  return axios.put(`${ip3}/don-dvmc/my/${idDon}`, payload);
}

export async function thongKeDon() {
  return axios.get(`${ip3}/don-dvmc/my/thong-ke`);
}
