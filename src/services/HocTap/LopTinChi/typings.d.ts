import type { ELoaiDauDiemHocPhan } from '@/utils/constants';

export declare module LopTinChi {
  export interface IRecord {
    _id: string;
    ten: string;
    hocKyId: string;
    hocKy?: HocKy.IRecord;
    hocPhanId: string;
    hocPhan?: HocPhan.IRecord;
    siSoToiDa: number;
    parentId?: string;
    parent?: IRecord;
    sinhVienList: LopTinChi.ThongTinSinhVien[];
    nhanSuList: NhanSu.IRecord[];
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
    ngay: string;
    nhanSuSsoId: string;
    createdAt: string;
    updatedAt: string;
    lopHocPhanId: string;
    lopHocPhan: LopTinChi.IRecord;
    tietBatDauId: string;
    tietBatDau: TietHoc.IRecord;
    tietKetThuc: TietHoc.IRecord;
    phongHoc: string;
    tieuDeBaiHoc: string;
    noiDungBaiHoc: string;
    urlBaiHoc: [string];
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
