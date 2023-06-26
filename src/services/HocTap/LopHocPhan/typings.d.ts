import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { type ELoaiLopHocPhan, type ETrangThaiDangKyGiangDay } from './constant';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';

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
  }

  export interface IRecordNhanSuLopHP {
    _id: string;
    lopHocPhanId: string;
    lopHocPhan: IRecord;
    nhanSuSsoId: string;
    nhanSu?: ToChucNhanSu.INhanSu;
    trangThai: ETrangThaiDangKyGiangDay;
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
