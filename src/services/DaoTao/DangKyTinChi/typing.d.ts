import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type HocPhan } from '../HocPhan/typings';
import {
  type ETrangThaiHocPhanDangKyTinChi,
  type ELoaiHocPhanDangKyTinChi,
  type ETrangThaiDangKyTinChi,
} from './constant';

declare module DangKyTinChi {
  export interface IDotDangKy {
    _id: string;
    ten: string;
    maHocKy: string;
    hocKy?: HocKy.IRecord;
    kichHoat: boolean;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
  }

  export interface IPhieuDangKy {
    _id: string;
    idDotDangKyTinChi: string;
    sinhVienSsoId: string;
    // sinhVien?: SinhVien.IRecord;
    maHocKy: string;
    // hocKy?: HocKy.IRecord;
    soTinChiDaDk: number;
    soTinChiToiThieu: number;
    soTinChiToiDa: number;
    maSvHk: string;
    lopHpSvList: LopHocPhan.IRecordSinhVienLopHP[];
  }

  export interface ILopDangKy extends LopHocPhan.IRecord {
    soTinChi: number;
    loai?: ELoaiHocPhanDangKyTinChi;
    trangThai: ETrangThaiDangKyTinChi;

    // temp
    error?: string;
  }

  export interface IHocPhanDangKy {
    maHocPhan: string;
    hocPhan?: Partial<HocPhan.IRecord>;
    nhuCau: boolean;
    loai: ELoaiHocPhanDangKyTinChi;
    trangThai: ETrangThaiHocPhanDangKyTinChi;
    hpTienQuyet?: Partial<HocPhan.IRecord>;
    hpHocTruoc?: Partial<HocPhan.IRecord>;
  }
}
