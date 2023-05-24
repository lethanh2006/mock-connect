import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function thongKeNhanSu() {
  return axios.get(`${ip3}/dashboard/thong-ke-nhan-su`);
}

export async function thongKeDonVi() {
  return axios.get(`${ip3}/dashboard/thong-ke-theo-don-vi`);
}

export async function thongKeThongBao() {
  return axios.get(`${ip3}/dashboard/thong-ke-thong-bao`);
}

export async function thongKePhanHoi() {
  return axios.get(`${ip3}/dashboard/thong-ke-phan-hoi`);
}

export async function thongkeDVMC() {
  return axios.get(`${ip3}/dashboard/thong-ke-dvmc`);
}

export async function thongKeKetQuaHocTap() {
  return axios.get(`${ip3}/dashboard/sinh-vien/ket-qua-hoc-tap`);
}

export async function adminGetTongSoDon(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/admin/tong-so-don`, { params: payload });
}

export async function adminGetSoDonDaXuLy(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/admin/so-don-da-xu-ly`, { params: payload });
}

export async function adminGetSoDonHomNay(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/admin/so-don-hom-nay`, { params: payload });
}

export async function chuyenVienDieuPhoiGetTongSoDon(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
  me?: number;
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/chuyen-vien-dieu-phoi/tong-so-don`, {
    params: payload,
  });
}

export async function chuyenVienDieuPhoiGetSoDonDaXuLy(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/chuyen-vien-dieu-phoi/so-don-da-xu-ly`, {
    params: payload,
  });
}

export async function chuyenVienDieuPhoiGetSoDonHomNay(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/chuyen-vien-dieu-phoi/so-don-hom-nay`, {
    params: payload,
  });
}

export async function chuyenVienXuLyGetTongSoDon(payload?: {
  idDichVu?: string;
  loaiDichVu: 'DVMC' | 'VAN_PHONG_SO';
  me?: number;
}) {
  return axios.get(`${ip3}/dashboard/thong-ke-don/chuyen-vien-tiep-nhan/tong-so-don`, {
    params: payload,
  });
}
