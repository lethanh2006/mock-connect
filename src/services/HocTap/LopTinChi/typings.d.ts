import type { ELoaiDauDiemHocPhan } from '@/utils/constants';
import { type ELoaiHinhHocTap } from './constant';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';

export declare module LopTinChi {
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
    thoiKhoaBieuList?: IBuoiHoc;
  }

  export interface ThongTinChungLopTinChiRecord {
    giangVien?: Login.Profile;
    giangVienList: Login.Profile[];
    sinhVienList: ThongTinSinhVien[];
    soBuoiVang?: any[];
    soBuoiVangCoPhep?: any[];
    diemCong?: IDiemCong[];
  }

  export interface ThongTinSinhVien extends Partial<Login.Profile> {
    soBuoiVang?: any[];
    soBuoiVangCoPhep?: any[];
    diemCong?: IDiemCong[];
    ten: string;
    ma: string;
  }

  export interface IBuoiHoc {
    _id: string;
    lopHocPhanId: string;
    lopHocPhan?: IRecord;
    nhanSuSsoId?: string; // 'string';
    nhanSu?: ToChucNhanSu.INhanSu;
    ngay: string; //'2023-05-20T08:34:26.620Z';
    nhomTietHocId: string; // 'string';
    // nhomTietHoc: NhomTietHoc.IRecordCoSo;
    tietBatDau: number;
    tietKetThuc: number;
    phongHoc?: string;
    loaiHinhHocTap: ELoaiHinhHocTap;
    tieuDeBaiHoc?: string;
    noiDungBaiHoc?: string;
    urlBaiHoc?: string;
    thoiGianBatDau: string; //'2023-05-20T08:34:26.620Z';
    thoiGianKetThuc: string; // '2023-05-20T08:34:26.620Z';
  }

  export interface InfoMonHoc {
    id: number;
    loai_hoc_phan: string;
    ma_hoc_phan_moi: string;
    so_tin_chi: number;
    ten_hoc_phan: string;
    url_danh_sach_hoc_lieu: string;
    gio_tin_chi_yeu_cau: string;
    khoa_bo_mon_phu_trach: string;
    noi_dung_chi_tiet: string;
    objective_kien_thuc: string;
    objective_ky_nang: string;
    objective_thai_do: string;
    tom_tat_noi_dung: string;
    yeu_cau_ve_csvc: string;
  }

  export interface DiemTongKet {
    id: number;
    sinh_vien_id: [number, string];
    ma_dinh_danh: string;
    ten_sv: string;
    ky_nam_hoc_id: [number, string];
    ctk_nganh_id: any;
    ctk_chuyen_nganh_id: any;
    ky_ctk: number;
    tong_so_tin_chi_da_dang_ky: number;
    tong_so_tin_chi_duoc_mien: number;
    diem_tb_tich_luy_hoc_ky: number;
    diem_tb_chung_hoc_ky: number;
    tong_so_tin_chi_trong_hoc_ky: number;
    tong_so_tin_chi_tich_luy_sau_hoc_ky: number;
    diem_tb_tich_luy_hoc_ky_thang_4: number;
    diem_tb_chung_hoc_ky_thang_4: number;
    xep_loai_hoc_luc_hoc_ky: string;
    so_tin_chi_truot_trong_hoc_ky: number;
    trang_thai: string;
    ket_qua_hoc_tap_nam_hoc_id: boolean;
    hinh_thuc_dao_tao_id: [number, string];
    display_name: string;
    create_uid: [number, string];
    create_date: string;
    write_uid: [number, string];
    write_date: string;
    ky_hoc: KyHoc.Record;
  }
}

declare module TietHoc {
  export interface IRecord {
    _id: string;
    tietHoc: number;
    timeBatDau: string;
    timeKetThuc: string;
    createdAt: string;
    updatedAt: string;
    nhomTietHocId: string;
  }
}
