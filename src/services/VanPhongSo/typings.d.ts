import { ECsvc, ETrangThaiDonVps } from '@/utils/constants';

declare module VanphongsoCsvc {
  export interface XeRecord {
    _id: string;
    loai: ECsvc.XE;
    info: {
      tenXe: string;
      loaiXe: string;
      ghiChu: string;
      bienSoXe: string;
    };
  }
  export interface PhongHopRecord {
    _id: string;
    loai: ECsvc.PHONG;
    active: boolean;
    info: {
      tenPhong: string;
      toaNha: string;
      soPhong: string;
      soCho: string;
      ghiChu: string;
    };
    value?: string;
  }
  export interface DonPhongHopRecord {
    bienSoXe: string;
    hoTen: string;
    idCoSoVatChat: string;
    idDon: string;
    idNguoiDuyet: string;
    maDinhDanh: string;
    thoiGianBd: string;
    thoiGianKt: string;
    trangThai: ETrangThaiDonVps;
    _id: string;
  }
  export interface ThongKeDonVps {
    MUON_OTO: {
      tong: number;
      ok: number;
      not_oke: number;
      processing: number;
    };
    MUON_PHONG_HOC: {
      tong: number;
      ok: number;
      not_oke: number;
      processing: number;
    };
    BAO_CAO_SU_CO: {
      tong: number;
      ok: number;
      not_oke: number;
      processing: number;
    };
    allXeDangDung: number;
    allPhongDangDung: number;
    allXeCSVC: number;
    allPhongCSVC: number;
  }
  export interface DataSoLuongDon {
    tong: number;
    ok: number;
    not_oke: number;
    processing: number;
  }
}
