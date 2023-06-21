import { type EKieuLapSuKien, type ELoaiDoiTuongSuKien, type ELoaiSuKien } from './constant';

declare module SuKien {
  export interface RecordLopTinChi {
    id: number;
    ten_lop_tin_chi: string;
  }
  export interface RecordNganh {
    id: number;
    ten_nganh: string;
  }
  export interface RecordDonVi {
    id: number;
    ten_don_vi: string;
  }
  export interface RecordKhoa {
    id: number;
    display_name: string;
  }
  export interface RecordLopHanhChinh {
    id: number;
    ten_lop_hanh_chinh: string;
  }
  export interface RecordNguoiCuThe {
    code: number;
    name: string;
  }

  export interface IRecord {
    _id: string;
    tenSuKien: string;
    loaiSuKien: ELoaiSuKien;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    diaDiem: string;
    ghiChu: string;
    lapLai: boolean;
    soLanLap: number;
    kieuLapSuKien: EKieuLapSuKien;
    loaiDoiTuong: ELoaiDoiTuongSuKien;
    // dataLopTinChi: RecordLopTinChi[];
    // dataDonVi: RecordDonVi[];
    // dataKhoa: RecordKhoa[];
    // dataLopHanhChinh: RecordLopHanhChinh[];
    // dataNganh: RecordNganh[];
    // dataUser: RecordNguoiCuThe[];
    // userCodeList: string[];
    // lopHanhChinhList: number[];
    // lopTinChiList: number[];
    // donViList: number[];
    // khoaList: number[];
    // nganhList: number[];
    // roles: string[];
    // info: {
    //   hinh_thuc: string;
    //   ghi_chu: string;
    //   can_bo_coi_thi: string;
    //   email: string;
    //   dien_thoai: string;
    //   hoc_phan_id: [number, string];
    //   ten_giang_vien: string;
    //   giang_vien_id: [number, string];
    //   ten_hoc_phan: string;
    //   link_zoom: string;
    //   dien_thoai: string;
    //   can_bo_id: [number, string];
    //   id: number;
    //   id_zoom: string;
    //   lop_tin_chi_id: [number, string];
    //   mat_khau: string;
    //   mat_khau_1: string;
    //   mon_hoc_id: [number, string];
    //   nganh: string;
    //   ngay_bd: string;
    //   nhom_lop: number;
    //   nhom_lop_tin_chi_id: [number, string];
    //   so_tiet: number;
    //   so_tin_chi: number;
    //   tai_khoan: string;
    //   tiet_bd: number;
    //   tong_so_sinh_vien: number;
    // };
  }
}
