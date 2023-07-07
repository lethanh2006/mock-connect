import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type SinhVien } from '../SinhVien/typings';
import type { ELoaiDangKyTinChi, ETrangThaiDangKyTinChi } from './constant';

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
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    maHocKy: string;
    hocKy?: HocKy.IRecord;
    soTinChiDaDk: number;
    soTinChiToiThieu: number;
    soTinChiToiDa: number;
    maSvHk: string;
    lopHpSvList: Partial<LopHocPhan.IRecordSinhVienLopHP>[];
  }

  export interface ILopDangKy extends Partial<LopHocPhan.IRecord> {
    soTinChi: number;
    loaiDangKy: ELoaiDangKyTinChi;
    trangThai: ETrangThaiDangKyTinChi;
  }
}
