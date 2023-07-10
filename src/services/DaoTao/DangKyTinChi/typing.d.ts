import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type SinhVien } from '../SinhVien/typings';
import {
  type ELoaiHocPhanDangKyTinChi,
  type ELoaiDangKyTinChi,
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
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    maHocKy: string;
    hocKy?: HocKy.IRecord;
    soTinChiDaDk: number;
    soTinChiToiThieu: number;
    soTinChiToiDa: number;
    maSvHk: string;
    lopHpSvList: LopHocPhan.IRecordSinhVienLopHP[];
  }

  export interface ILopDangKy extends LopHocPhan.IRecord {
    soTinChi: number;
    loaiDangKy: ELoaiDangKyTinChi;
    trangThai: ETrangThaiDangKyTinChi;
  }

  export interface IHocPhanDangKy {
    idHocPhan: string; // '6492ade44d774dc26787ad24';
    maMonHoc: string; // 'DHBC03';
    tenMonHoc: string; // 'Kịch bản truyền thông';
    trangThaiDangKy: string; // 'Được phép đăng ký';
  }

  export interface ThongTinHocPhan extends Record<ELoaiHocPhanDangKyTinChi, IHocPhanDangKy[]> {
    kyTruoc: IHocPhanDangKy[];
    mien: IHocPhanDangKy[];
  }
}
