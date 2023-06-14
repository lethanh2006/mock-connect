import type {
  EChucNangSuDung,
  ELoaiDoiTuong,
  ELoaiDot,
  EPhamVi,
  EVaiTroBieuMau,
} from '@/utils/constants';
import type { BieuMau } from '../BieuMau/typings';

declare module DotKhaoSat {
  export interface Record {
    danhSachVaiTro: EVaiTroBieuMau;
    chucNangSuDung: EChucNangSuDung[];
    ten: string;
    moTa: string;
    loai: ELoaiDot;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    kichHoat: boolean;
    idKhaoSat: string;
    danhSachLopTinChi: BieuMau.GeneralInfo[];
    danhSachLopHanhChinh: BieuMau.GeneralInfo[];
    danhSachNguoiDung: BieuMau.GeneralInfo[];
    danhSachKhoaHoc: BieuMau.GeneralInfo[];
    danhSachNganhHoc: BieuMau.GeneralInfo[];
    danhSachDonVi: BieuMau.GeneralInfo[];
    loaiDoiTuongSuDung: ELoaiDoiTuong[];
    phamVi: EPhamVi;
    hinhThucDaoTaoId: string;
    _id: string;
    daLam: boolean;
  }
}
