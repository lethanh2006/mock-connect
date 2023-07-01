import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { type ELoaiDiemChu, type ELoaiLopHocPhan, type ETrangThaiDangKyGiangDay } from './constant';

export declare module LopHocPhan {
  export interface IRecord {
    _id: string;
    ten: string;
    tenCha?: string;
    maLop: string;
    maLopCha?: string;
    maHocKy: string;
    hocKy?: HocKy.IRecord;
    maHocPhan: string;
    hocPhan?: HocPhan.IRecord;
    siSoToiDa: number;
    siSo?: number; // Sĩ số hiện tại
    loai: ELoaiLopHocPhan;
    // parentId?: string | null;
    soThuTuLop?: number;
    soThuTuNhom?: number;

    parent?: IRecord;
    children?: IRecord[];
    nhanSuList?: ToChucNhanSu.INhanSu[];
    sinhVienList?: SinhVien.IRecord[];
    // maHoaLichHoc?: TMaHoaLichHoc[];
    thoiKhoaBieuList?: ThoiKhoaBieu.IRecord;

    // Populated
    deCuongHpHk?: {
      deCuongId: string;
    };
  }

  export interface IRecordNhanSuLopHP {
    _id: string;
    lopHocPhanId: string;
    lopHocPhan: IRecord;
    nhanSuSsoId: string;
    nhanSu?: ToChucNhanSu.INhanSu;
    trangThai: ETrangThaiDangKyGiangDay;
  }

  export interface IRecordSinhVienLopHP extends IDiemThanhPhan, IDiemThi, IDiemTongKet {
    _id: string;
    lopHocPhanId: string;
    lopHocPhan: IRecord;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;

    khoa: boolean;
    khoaDiemThi: boolean;
    nopDiem: boolean;
    public: boolean;
    publicDiemThi: boolean;

    // Populate
    kyHoc?: HocKy.IRecord;
    hocPhan?: HocPhan.IRecord;
    soTinChi?: number;
    soThuTuKy?: number;
  }

  export interface IDiemThanhPhan {
    diemThanhPhan1?: number;
    diemThanhPhan2?: number;
    diemThanhPhan3?: number;
    diemThanhPhan4?: number;
    diemThanhPhan5?: number;
    diemThanhPhan6?: number;
    diemThanhPhan7?: number;
    diemThanhPhan8?: number;
    diemThanhPhan9?: number;
    diemThanhPhan10?: number;
  }

  export interface IDiemThi {
    diemThi1?: number;
    diemThi2?: number;
  }

  export interface IDiemTongKet {
    // diemKthp?: number;
    diemTongKet?: number;
    diemThang4?: number;
    diemChu?: ELoaiDiemChu;
  }

  export interface ThongTinChungLopTinChiRecord {
    giangVien?: Login.Profile;
    giangVienList: Login.Profile[];
    sinhVienList: ThongTinSinhVien[];
    soBuoiVang?: any[];
    soBuoiVangCoPhep?: any[];
    diemCong?: IDiemCong[];
  }
}
