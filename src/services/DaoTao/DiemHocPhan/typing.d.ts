import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type HocPhan } from '../HocPhan/typings';
import { type SinhVien } from '../SinhVien/typings';
import { type ELoaiHocPhanCTDT } from '../constant';

declare module DiemHocPhan {
  export interface IRecord extends LopHocPhan.IDiemTongKet {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    maHocPhan: string;
    hocPhan?: HocPhan.IRecord;
  }

  export interface IDiemSinhVien extends LopHocPhan.IDiemTongKet, HocPhan.IRecord {
    soTinChi?: number;
    loaiHocPhanCtdt: ELoaiHocPhanCTDT;
    soLanHoc?: number;
    trangThai?: string;

    //
    diemDuKien?: number;
    diemDuKienThang4?: number;
  }
}
