import axios from '@/utils/axios';
import { ETrangThaiDonVps } from '@/utils/constants';
import { ip3 } from '@/utils/ip';

export async function getCsvcTheoLoai(payload: { loaiCsvc: string; condition: any }) {
  const { loaiCsvc, condition } = payload;
  return axios.get(`${ip3}/quan-ly-co-so-vat-chat/${loaiCsvc}/all`, {
    params: { condition },
  });
}

export async function getCsvcPageable(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/quan-ly-co-so-vat-chat`, { params: payload });
}

export async function getCsvcById(id: string) {
  return axios.get(`${ip3}/quan-ly-co-so-vat-chat/${id}`);
}

export async function postCsvc(payload: any) {
  return axios.post(`${ip3}/quan-ly-co-so-vat-chat`, payload);
}

export async function putCsvc(id: string, payload: any) {
  return axios.put(`${ip3}/quan-ly-co-so-vat-chat/${id}`, payload);
}

export async function deleteCsvc(id: string) {
  return axios.delete(`${ip3}/quan-ly-co-so-vat-chat/${id}`);
}

export async function getAllDonVPS() {
  return axios.get(`${ip3}/don-dvmc/vps/dich-vu/all`);
}

export async function getXeKhaDung(payload: {
  thoiGianBd: string;
  thoiGianKt: string;
  loaiXe?: string;
}) {
  return axios.post(`${ip3}/thong-tin-muon-xe/xe/all/kha-dung`, payload);
}

export async function getXeKhongKhaDung(payload: {
  thoiGianBd: string;
  thoiGianKt: string;
  loaiXe?: string;
}) {
  return axios.post(`${ip3}/thong-tin-muon-xe/xe/all/khong-kha-dung`, payload);
}

export async function getXeKhaDungTheoIdDon(payload: { idDon: string; bienSoXe: string }) {
  return axios.post(
    `${ip3}/thong-tin-muon-xe/${payload?.idDon}/xe/all/kha-dung`,
    payload?.bienSoXe,
  );
}

export async function getAllPhong() {
  return axios.get(`${ip3}/thong-tin-muon-phong/all`);
}

export async function getAllPhongKhaDung(payload: any) {
  return axios.post(`${ip3}/thong-tin-muon-phong/phong/all/kha-dung`, payload);
}

export async function getAllPhongKhongKhaDung(payload: any) {
  return axios.post(`${ip3}/thong-tin-muon-phong/phong/all/khong-kha-dung`, payload);
}

export async function getCheckPhongKhaDungTheoIdDon(idDon: string) {
  return axios.get(`${ip3}/thong-tin-muon-phong/${idDon}/check-phong-kha-dung`);
}

export async function getAllDonMuonPhongByIdDon(idDon: any) {
  return axios.post(`${ip3}/thong-tin-muon-phong/${idDon}/phong/all/don/muon-phong`);
}

export async function getAllDonDangSuDung() {
  return axios.get(`${ip3}/don-dvmc/all-don-co-so-vat-chat-dang-su-dung`);
}

export async function getThongTinMuonXe(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/thong-tin-muon-xe`, { params: payload });
}

export async function getMeThongTinMuonXe(payload: {
  page: number;
  limit: number;
  condition: any;
}) {
  return axios.get(`${ip3}/thong-tin-muon-xe/me`, { params: payload });
}

export async function putTrangThaiDonMuonXe(payload: { trangThai: ETrangThaiDonVps; id: string }) {
  return axios.put(`${ip3}/thong-tin-muon-xe/${payload?.id}/trang-thai-muon-xe`, {
    trangThai: payload?.trangThai,
  });
}

export async function putMeHuyMuonXe(payload: { trangThai: ETrangThaiDonVps; id: string }) {
  return axios.put(`${ip3}/thong-tin-muon-xe/${payload?.id}/me-huy-muon-xe`, {
    trangThai: payload?.trangThai,
  });
}

export async function putMeHuyMuonPhong(payload: { trangThai: ETrangThaiDonVps; id: string }) {
  return axios.put(`${ip3}/thong-tin-muon-phong/${payload?.id}/me-huy-muon-phong`, {
    trangThai: payload?.trangThai,
  });
}

export async function getThongKeDonVps(payload?: any) {
  return axios.post(`${ip3}/don-dvmc/thong-ke-vps`, payload);
}
