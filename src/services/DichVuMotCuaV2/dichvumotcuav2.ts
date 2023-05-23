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

export async function adminGetDonSinhVien(payload: {
  condition: any;
  page: number;
  limit: number;
}) {
  return axios.get(`${ip3}/don-dvmc/admin/don/pageable`, {
    params: payload,
  });
}

export async function chuyenVienDieuPhoiGetDonSinhVien(payload: {
  condition: any;
  page: number;
  limit: number;
  me?: number;
}) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-dieu-phoi/don/pageable`, {
    params: payload,
  });
}

export async function chuyenVienTiepNhanGetDonSinhVien(payload: {
  condition: any;
  page: number;
  limit: number;
  me?: number;
}) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-tiep-nhan/don/pageable`, {
    params: payload,
  });
}

export async function userGetAllBieuMau(payload: { condition: any }) {
  return axios.get(`${ip3}/dvmc/me/all`, { params: payload });
}

export async function adminGetAllBieuMau(payload: { condition: any }) {
  return axios.get(`${ip3}/dvmc`, { params: payload });
}

export async function postBieuMauAdmin(payload: DichVuMotCuaV2.BieuMau) {
  return axios.post(`${ip3}/dvmc`, payload);
}

export async function putBieuMauAdmin(payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) {
  return axios.put(`${ip3}/dvmc/${payload.id}`, payload.data);
}

export async function putTrangThaiBieuMau(idBieuMau: string) {
  return axios.put(`${ip3}/dvmc/${idBieuMau}/trang-thai`);
}

export async function deleteBieuMauAdmin(id: string) {
  return axios.delete(`${ip3}/dvmc/${id}`);
}

export async function postDonSinhVien(payload: {
  duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
  dichVuId: string;
}) {
  return axios.post(`${ip3}/don-dvmc/my`, payload);
}

export async function getDonThaoTacChuyenVienDieuPhoi(payload: {
  condition: any;
  page: number;
  limit: number;
}) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-dieu-phoi/don-thao-tac/pageable`, {
    params: payload,
  });
}

export async function getDonThaoTacChuyenVienXuLy(payload: {
  condition: any;
  page: number;
  limit: number;
}) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-xu-ly/don-thao-tac/pageable`, {
    params: payload,
  });
}

export async function chuyenVienDieuPhoiDuyetDon(payload: {
  type: string;
  idDonThaoTac: string;
  data: {
    urlFileDinhKem: string[];
  };
}) {
  return axios.post(
    `${ip3}/don-dvmc/chuyen-vien-dieu-phoi/don-thao-tac/${payload.idDonThaoTac}/duyet/${payload.type}`,
    payload.data,
  );
}

export async function chuyenVienXuLyDuyetDon(payload: {
  type: string;
  idDonThaoTac: string;
  data: {
    urlFileDinhKem: string[];
  };
}) {
  return axios.post(
    `${ip3}/don-dvmc/chuyen-vien-xu-ly/don-thao-tac/${payload.idDonThaoTac}/duyet/${payload.type}`,
    payload.data,
  );
}

export async function getAllBieuMauChuyenVienDieuPhoi(payload: { condition: any }) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-dieu-phoi/dvmc/all`);
  // return axios.get(`${ip3}/don-dvmc/chuyen-vien-dieu-phoi/don/pageable`);
}

export async function getAllBieuMauChuyenVienTiepNhan(payload: { condition: any }) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-tiep-nhan/dvmc/all`, { params: payload });
}

export async function dieuPhoiDon(payload: {
  idDonThaoTac: string;
  data: {
    nguoiDuocGiao: {
      _id: string;
      hoTen: string;
      gioiTinh: string;
      ngaySinh: string;
      maDinhDanh: string;
    };
  };
}) {
  return axios.post(
    `${ip3}/don-dvmc/chuyen-vien-dieu-phoi/don-thao-tac/${payload.idDonThaoTac}/dieu-phoi`,
    payload.data,
  );
}

export async function sinhVienGetTrangThaiDon(idDon: string, payload: { condition: any }) {
  return axios.get(`${ip3}/don-dvmc/sinh-vien/me/don-dvmc/${idDon}/buoc`, { params: payload });
}

export async function chuyenVienDieuPhoiGetTrangThaiDon(
  idDon: string,
  payload: { condition: any },
) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-dieu-phoi/${idDon}/buoc`, { params: payload });
}

export async function chuyenVienTiepNhanGetTrangThaiDon(
  idDon: string,
  payload: { condition: any },
) {
  return axios.get(`${ip3}/don-dvmc/chuyen-vien-tiep-nhan/${idDon}/buoc`, { params: payload });
}

export async function adminGetTrangThaiDon(idDon: string, payload: { condition: any }) {
  return axios.get(`${ip3}/don-dvmc/admin/don-dvmc/${idDon}/buoc`, { params: payload });
}

export async function thongKeDon() {
  return axios.get(`${ip3}/don-dvmc/my/thong-ke`);
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

export async function adminDeleteDon(idDon: string) {
  return axios.delete(`${ip3}/don-dvmc/${idDon}`);
}

export async function sinhVienDeleteDon(idDon: string) {
  return axios.delete(`${ip3}/don-dvmc/my/${idDon}`);
}

export async function nhanVienDeleteDon(idDon: string) {
  return axios.delete(`${ip3}/don-dvmc/${idDon}`);
}

export async function sinhVienPutDon(
  idDon: string,
  payload: { duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] },
) {
  return axios.put(`${ip3}/don-dvmc/my/${idDon}`, payload);
}

export async function adminPutDon(
  idDon: string,
  payload: { duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] },
) {
  return axios.put(`${ip3}/don-dvmc/${idDon}`, payload);
}

export async function updateTrangThaiNhanKetQua(id: string, daTraKetQua: boolean) {
  return axios.put(
    `${ip3}/don-dvmc/update-trang-thai-nhan-ket-qua/${id}?daTraKetQua=${daTraKetQua}`,
  );
}
