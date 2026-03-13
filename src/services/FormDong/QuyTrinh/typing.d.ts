import type { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import type {
  EDoiTuong,
  ELoaiThoiHanXuLy,
  ENgayTrongTuan,
  ENguonDot,
  EPhanHe,
  EVaiTro,
} from '@/services/QuyTrinh/constant';
import type { EDoiTuongPhamViQuyTrinh, EVaiTroPhamViQuyTrinh } from './constant';

declare module QuyTrinh {
  export interface PhamViQuyTrinh {
    index: number;
    doiTuong: EDoiTuongPhamViQuyTrinh;
    danhSachVaiTro: EVaiTroPhamViQuyTrinh[];
    danhSachMaThamChieu: string[];
    guiDenNguoiCuThe: string[];
    danhSachNguoiNhanSv: IThanhVienXuLy[];
    danhSachNguoiNhanGvCb: IThanhVienXuLy[];
  }

  export interface CanBoXuLy {
    ten: string;
    ma: string;
    danhSachLinhVuc: string[];
  }

  export interface IRecord {
    _id: string;
    ten: string;
    ghiChu: string;
    moTa: string;
    active: boolean;
    isTraKetQua: boolean;
    soNgayHenTraKetQua?: number;
    maFormHienThi: string;
    maTruongHienThi: string;
    linhVuc: string;
    choPhepGuiNhieuLan: boolean;
    danhSachPhamViQuyTrinh: PhamViQuyTrinh[];
    danhSachFormKhaiBao: IMauDon[];
    danhSachFormTiepNhan: IMauDon[];
    danhSachBoPhanXuLy: IBoPhanXuLy[];
    boPhanChiuTrachNhiem: IBoPhanXuLy;
    danhSachMappingDoiTuong: IDoiTuongMapping[];
    danhSachCauHinhThongTinChung: IDanhSachCauHinhThongTinChung[];
    cauHinhDotQuyTrinh: ICauHinhDotQuyTrinh;
    cauHinhValidate: ICauHinhDotQuyTrinh;
    danhSachBuocXuLy: IBuocXuLy[];
    danhSachVanBanLuuTru: string[];
    cauTrucThanhToan: {
      ten: string;
      yeuCauTraPhi: boolean;
      idNguonThu: string;
      idKhoanThu: string;
      idMucThu: string;
      thanhToanTheoSoLuong: boolean;
      maFormThamChieuSoLuongThanhToan: string;
      maTruongThamChieuSoLuongThanhToan: string;
    };
    phanHe: EPhanHe[];
    order: number;
    [key: string]: any;
  }
  export interface ICauHinhDotQuyTrinh {
    nguonDot: ENguonDot;
    phanHeNguon: EPhanHe;
    internalPath: string;
    internalPathMy: string;
  }
  export interface IUser {
    ssoId: string;
    ten: string;
    vaiTroHoiDong: string;
    ma: string;
    donVi: string;
    maDonVi: string;
    hocHam: string;
    hocVi: string;
    soDienThoai: string;
    email: string;
  }
  export interface IDanhSachPhamViQuyTrinh {
    doiTuong: EDoiTuong;
    danhSachVaiTro: EVaiTro[];
    danhSachMaThamChieu: string[];
    guiDenNguoiCuThe: [string];
    danhSachNguoiNhanSv: IUser[];

    danhSachNguoiNhanGvCb: IUser[];
  }
  export interface IDoiTuongMapping {
    truongThongTin: string;
    giaTri: any;
    id: string;
  }
  export interface IDanhSachCauHinhThongTinChung {
    ten: string;
    noiDung: string;
    html: boolean;
    [key: string]: any;
  }
  export interface IMauDon {
    ten: string;
    ma: string;
    cauHinhLoaiHinh: LoaiHinh.TruongThongTin[];
    fileId: string;
    file: { name: string }[];
    [key: string]: any;
  }
  export interface IBuocXuLy {
    ten: string;
    ma: string;
    moTa: string;
    suDungForm: true;
    maFormKhaiBao: string;
    maFormTiepNhan: string;
    danhSachMaBoPhanXuLy: string[];
    vanBan: VanBan.IRecord;
    danhSachVanBanLuuTru: { tenFile: string; url: string }[];
    loaiThoiHanXuLy: ELoaiThoiHanXuLy;
    soNgayXuLy: number;
    danhSachNgayXuLy: ENgayTrongTuan[];
    [key: string]: any;
  }

  export interface IDanhSachForm {
    ten: string;
    ma: string;
    cauHinhLoaiHinh: TruongThongTin[];
  }
  export interface TruongThongTin {
    ten: string;
    ma: string;
    ghiChu: string;
    kieuDuLieu: EKieuDuLieu;
    maDanhMuc: string;
    danhSachCot: Cot[];
    kichHoat: boolean;
    batBuoc: boolean;
    truongThongTinLienQuan: string;
    giaTriLienQuan: any;
    colspan: number;
    danhSachCotHienThi: string[];
    laDangMang: boolean;
    textarea: boolean;
    loaiHinhNckhId: string;
    danhSachFileDinhKem: string[];
    ghiChuFileDinhKem: string;
  }
  export interface Cot {
    ten: string;
    ma: string;
    kieuDuLieu: EKieuDuLieu;
    maDanhMuc: string;
    kichHoat: boolean;
    batBuoc: boolean;
    truongThongTinLienQuan: string;
    giaTriLienQuan: any;
    danhSachCot: Cot[];
    laDangMang: boolean;
    colspan: number;
    danhSachCotHienThi: string[];
    textarea: boolean;
    loaiHinhNckhId: string;
    danhSachFileDinhKem: string[];
    ghiChuFileDinhKem: string;
  }
  export interface IBoPhanXuLy {
    ten: string;
    ma: string;
    phuongThucPhanCong: string;
    danhSachThanhVienXuLy: IThanhVienXuLy[];
    maDonVi: string;
    theoDoiToanBo: boolean;
    [key: string]: any;
  }
  export interface IBoPhanXuLyByBuoc {
    maBuoc: string;
    boPhanXuLy: IBoPhanXuLy[];
  }
  export interface IThanhVienXuLy {
    ssoId: string;
    ten: string;
    ma: string;
    donVi: string;
    hocHam: string;
    hocVi: string;
    soDienThoai: string;
    email: string;
    [key: string]: any;
  }

  export interface IPhamViDanhSachDonVi {
    maDonVi: string;
    tenDonVi: string;
    danhSachViTri: {
      _id: string;
      capChucVu: string;
      tenChucVu: string;
    }[];
  }
}
