import { type BieuMau } from '../BieuMau/typing';
import { type EPhamViChuDe } from '@/services/TinTuc/constant';

declare module DotKhaoSat {
  export interface IRecord {
    _id: string;
    ten: string;
    moTa: string;
    // danhSachVaiTro: EVaiTroBieuMau;
    // chucNangSuDung: EChucNangSuDung[];
    // loai: ELoaiDot;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    kichHoat: boolean;
    idBieuMau: string;
    bieuMau?: BieuMau.Record;
    danhSachLopTinChi: BieuMau.GeneralInfo[];
    danhSachLopHanhChinh: BieuMau.GeneralInfo[];
    danhSachNguoiDung: BieuMau.GeneralInfo[];
    danhSachKhoaHoc: BieuMau.GeneralInfo[];
    danhSachNganhHoc: BieuMau.GeneralInfo[];
    danhSachDonVi: BieuMau.GeneralInfo[];
    loaiDoiTuongSuDung: ELoaiDoiTuong[];
    phamVi: EPhamViChuDe;
    hinhThucDaoTaoId: string;
    daLam: boolean;
  }
}
