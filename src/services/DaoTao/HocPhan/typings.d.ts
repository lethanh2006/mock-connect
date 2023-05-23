import { type ELoaiToChucDayHoc } from '../constant';

declare module HocPhan {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    tenTiengAnh?: string;
    donVi: string;
    soTinChi: number;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IDeCuongHocPhan {
    _id: string;
    ma: string;
    hocPhanId: string;
    hocPhan: IRecord;
    nguoiBienSoan: string;
    ngayApDung: string;
    canCuId: string;
    canCu: VanBanQuyDinh.IRecord;
    mucTieuHocPhan: string;
    noiDungTomTat: string;
    noiDungChiTiet: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IGiangVienDeCuong {
    _id: string;
    deCuongId: string;
    deCuong?: IDeCuongHocPhan;
    nhanSuSsoId: string | null;
    hoTen?: string | null;
    chucDanh?: string | null;
    hocHam?: string | null;
    hocVi?: string | null;
    soDienThoai?: string | null;
    diaChi?: string | null;
  }

  export interface ILichTrinhChung {
    _id: string;
    ten: string;
    deCuongHpId: string;
    gioLyThuyet: number;
    gioBaiTapTL: number;
    gioThucHanh: number;
    gioTuHoc: number;
  }

  export interface ITienTrinhHocPhan {
    _id: string;
    deCuongId: string;
    deCuong?: IDeCuongHocPhan;
    tuan: number;
    noiDung: string;
    noiDungChinh: string;
    yeuCauSinhVien: string;
    ghiChu: string;
    ndTienTrinhList?: INoiDungTienTrinh[];
  }

  export interface INoiDungTienTrinh {
    _id: string;
    tienTrinhHpId: string;
    tienTrinhHp?: ITienTrinhHocPhan;
    loaiToChucDayHoc: ELoaiToChucDayHoc;
    soTiet: number;
  }

  export interface IHocLieuDeCuong {
    _id: string;
    hocLieuId: string;
    hocLieu?: HocLieu.IRecord;
    deCuongId: string;
    deCuong?: IDeCuongHocPhan;
    batBuoc: boolean;
  }

  export interface ITrongSoHocPhan {
    _id: string;
    deCuongId: string;
    deCuong?: IDeCuongHocPhan;
    hinhThucDanhGiaId: string;
    hinhThucDanhGia?: DauDiemHocPhan.IRecord;
    hinhThucThiId: string;
    hinhThucThi?: HinhThucThi.IRecord;
    dacDiemDanhGia: string;
    tyLeDanhGia: number;
  }
}
