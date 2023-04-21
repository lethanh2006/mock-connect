import type { ELoaiDauDiemHocPhan } from '@/utils/constants';

export declare module LopTinChi {
  export interface Record {
    ten_hoc_phan: string;
    ten_lop_tin_chi: string;
    id: number;
    ky_nam_hoc_id: [number, string];
    ma_hoc_phan: [string];
    ma_lop: string;
    mon_hoc_ids: [number, string];
  }

  export interface DotDanhGia {
    _id: string;
    idKyHoc: number;
    tieuDe: string;
    noiDung: string;
    idBieuMau: string;
    thoiGianBatDau: Date;
    thoiGianKetThuc: Date;
    idHinhThuc: number;
    active: boolean;
    maKyHoc: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  export interface KetQuaHocTap {
    id: number;
    sinh_vien_id: [number, string];
    ma_dinh_danh: string;
    name: string;
    course_chuyen_can: number;
    course_ed_bt_viet_noi: number;
    course_ed_giay: number;
    course_ed_thi_cuoi_hp: number;
    course_ed_thi_giua_hp: number;
    course_ed_tt: number;
    diem_attendance: number;
    diem_bai_tap: number;
    diem_trung_binh_kiem_tra_tren_lop: number;
    diem_thi_nghiem: number;
    diem_cuoi_ky: string;
    diem_tong_ket: number;
    diem_thi_lan_2: number;
    diem_tong_ket_dang_chu: string;
    diem_tong_ket_thang_4: number;
    diem_doc: string;
    diem_nghe: string;
    diem_noi: string;
    diem_viet: string;
    diem_tong_tieng_anh: string;
    is_diem_tieng_anh: boolean;
    loai_dau_diem_hoc_phan: ELoaiDauDiemHocPhan;
    is_danh_gia: boolean;
    diemCong?: { lichSuDiem: IDiemCong[] }[];
    lop_tin_chi_id: [number, string];
  }

  export interface IGiaLapDiem {
    diem_chu?: string; //'D';
    diem_hoc_phan?: number; // 4.2;
    diem_thang_4?: number; //1;
    trang_thai: 'Đạt' | 'Không đạt' | 'Chưa học' | 'Chưa có điểm'; // 'Đạt';
    hoc_phan_id: number;
    ten_hoc_phan: string; // 'Đại số';
    ma_hoc_phan: string; // 'BAS1201';
    loai_hoc_phan: 'tu_chon' | 'bat_buoc';
    so_tin_chi: number; //3;
    diem_du_kien?: number;
    diem_du_kien_4?: number;
    is_danh_gia: boolean;
  }

  export interface DiemThanhPhan extends KetQuaHocTap {
    id: number;
    lop_tin_chi_id: [number, string];
    ma_lop: string;
    so_tin_chi: number;
    ten_hoc_phan: string;
    hoc_phan_id: [number, string];
    is_danh_gia: boolean;
  }

  export interface DiemTheoKy {
    ctk_nganh_id: [number, string];
    diem_tb_chung_hoc_ky: number;
    diem_tb_chung_hoc_ky_thang_4: number;
    diem_tb_tich_luy_hoc_ky: number;
    diem_tb_tich_luy_hoc_ky_thang_4: number;
    hinh_thuc_dao_tao_id: [number, string];
    id: number;
    ket_qua_hoc_tap_nam_hoc_id: [number, string];
    ky_ctk: number;
    ky_hoc: KyHoc.KyHocRecord;
    ky_nam_hoc_id: [number, string];
    so_tin_chi_truot_trong_hoc_ky: number;
    tong_so_tin_chi_da_dang_ky: number;
    tong_so_tin_chi_duoc_mien: number;
    tong_so_tin_chi_tich_luy_sau_hoc_ky: number;
    tong_so_tin_chi_trong_hoc_ky: number;
    tong_so_tin_chi_truot: number;
    trang_thai: boolean;
    xep_loai_hoc_luc_hoc_ky: boolean;
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
  }

  export interface IDiemCong {
    ghiChu: string;
    idBuoiHoc: number; //1126137;
    soDiemCong: number; // 1;
    ngay_bd: string; //'2022-08-20';
    ngay_gio_hoc: string; //'2022-08-20 09:00:00';
    ngay_gio_ket_thuc: string; //'2022-08-20 11:00:00';
    phong_hoc: string; //'302-A2';
    thoiGian: string;
    _id: string; // '636325911dd72994cc0dd911';
  }

  export interface IKetQuaHienTai {
    id: number; //34632;
    diem_tich_luy_thang_4: number; // 2.828;
    tong_so_tin_chi_tich_luy: number; //0;
    tong_so_tin_chi_da_hoc: number; //0;
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

  export interface NhomLopTinChi {
    id: number;
    ma_nhom_lop_tin_chi: string;
    so_thu_tu_nhom: number;
    ma_lop_tin_chi_id: (string | number)[];
    loai_nhom_lop: string;
    danh_sach_sinh_vien_ids: number[];
    buoi_hoc_ids: number[];
    display_name: string;
  }
}

export declare module BuoiHoc {
  export interface Record {
    id: number;
    lop_tin_chi_id: (number | string)[];
    nhom_lop_tin_chi_id: (number | string)[];
    mon_hoc_id: (number | string)[];
    ten_hoc_phan: string;
    tong_so_sinh_vien: number;
    so_luong_vang: number;
    thu_kieu_so: number;
    tuan_hoc: number;
    ngay_bd: string;
    tiet_bd: [number, string];
    so_tiet: number;
    can_bo_id: (number | string)[];
    giang_vien_da_diem_danh: boolean;
    dien_thoai: string;
    tai_khoan: string;
    mat_khau: string;
    phong_hoc: string;
    id_zoom: string;
    mat_khau_1: string;
    ngay_gio_hoc: string;
    ngay_gio_ket_thuc: string;
    diem_danh_buoi_hoc_ids: number[];
    tieu_de_bai_hoc: string;
    noi_dung_bai_hoc: string;
    url_bai_hoc: string[];
  }

  export interface SinhVienDiemDanh {
    id: number;
    buoi_hoc_id: [number, string];
    diem_cong: number;
    sinh_vien_id: [number, string];
    ten_sinh_vien: string;
    tuan_hoc: number;
    trang_thai: TTrangThaiDiemDanh;
  }

  export type TTrangThaiDiemDanh = 'Vắng có phép' | 'Vắng không phép' | 'Có mặt';

  export interface ListSinhVien {
    giangVienDaDiemDanh: boolean;
    siSo: number;
    vang: number;
    danhSachDiemDanh: SinhVienDiemDanh[];
  }
}

export declare module IResThongBaoLopTinChi {
  export interface Result {
    urlFile?: string[];
    _id?: string;
    senderId?: string;
    senderName?: string;
    title?: string;
    content?: string;
    htmlContent?: string;
    description?: string;
    imageUrl?: string;
    idTopic?: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
