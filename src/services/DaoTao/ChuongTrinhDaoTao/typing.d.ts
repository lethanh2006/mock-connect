import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type HocPhan } from '../HocPhan/typings';
import { type ETrangThaiHocTap, type ELoaiHocPhanCTDT } from '../constant';

declare module ChuongTrinhDaoTao {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    tenTiengAnh: string;
    trinhDoDaoTaoId: string;
    trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
    nganhId: string;
    nganh?: NganhDaoTao.IRecordCoSo;
    thoiGianDaoTao: number;
    tongSoTinChi: number;

    mucTieuDaoTao: string;
    doiTuongTuyenSinh: string;
    thangDiem: string;
    quyTrinhDaoTao: string;
    dieuKienTotNghiep: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IPhienBanCTDT {
    _id: string;
    chuongTrinhId: string;
    chuongTrinh?: IRecord;
    ma: string;
    canCuId: string;
    canCu?: VanBanQuyDinh.IRecord;
    ngayBanHanh: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IKhoiHocPhanCTDT {
    _id: string;
    phienBanId: string;
    phienBan?: IPhienBanCTDT;
    khoiKienThucId: string;
    khoiKienThuc?: KhoiKienThuc.IRecord;
    chuyenNganhId: string;
    chuyenNganh?: NganhDaoTao.IRecordCoSo;
    loaiHocPhanCtdt: ELoaiHocPhanCTDT;
    hocPhanId?: string;
    hocPhan?: HocPhan.IRecord;
    hocPhanTienQuyetId?: string;
    hocPhanTienQuyet?: HocPhan.IRecord;
    hocPhanTruocId?: string;
    hocPhanTruoc?: HocPhan.IRecord;
    hocPhanSongHanhId?: string;
    hocPhanSongHanh?: HocPhan.IRecord;
    soThuTuKy?: number;
    soTinChiTuChonPhaiHoc?: number;
    ten?: string; // Tên khối chương trình tự chọn
    hocPhanTuChonList?: IHocPhanTuChonCTDT[];

    hoc: ETrangThaiHocTap;
    lichSuDiem?: LopHocPhan.IRecordSinhVienLopHP[];
    soTinChi: number;
  }
}
