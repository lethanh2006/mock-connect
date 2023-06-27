import { type ELoaiToChucDayHoc } from '../constant';

declare module HocPhan {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    tenTiengAnh?: string;
    donVi: string;
    soTinChi: number;
    deCuongHienTaiId?: string;
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
    soTinChi: number;
    isTinhDiem: boolean;
    mucTieuHocPhan: string;
    noiDungTomTat: string;
    noiDungChiTiet: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;

    trongSo1?: number;
    trongSo2?: number;
    trongSo3?: number;
    trongSo4?: number;
    trongSo5?: number;
    trongSo6?: number;
    trongSo7?: number;
    trongSo8?: number;
    trongSo9?: number;
    trongSo10?: number;

    dacDiemDanhGia1?: string;
    dacDiemDanhGia2?: string;
    dacDiemDanhGia3?: string;
    dacDiemDanhGia4?: string;
    dacDiemDanhGia5?: string;
    dacDiemDanhGia6?: string;
    dacDiemDanhGia7?: string;
    dacDiemDanhGia8?: string;
    dacDiemDanhGia9?: string;
    dacDiemDanhGia10?: string;

    hinhThucThi1Id?: string;
    hinhThucThi2Id?: string;
    hinhThucThi3Id?: string;
    hinhThucThi4Id?: string;
    hinhThucThi5Id?: string;
    hinhThucThi6Id?: string;
    hinhThucThi7Id?: string;
    hinhThucThi8Id?: string;
    hinhThucThi9Id?: string;
    hinhThucThi10Id?: string;
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
