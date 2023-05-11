import type { MaDichVuVps } from '@/utils/constants';

declare module DichVuMotCuaV2 {
  export interface CauHinhBieuMau {
    dataSource: CauHinhBieuMau[];
    isRequired: boolean;
    _id: string;
    label: string;
    type: string;
    min: number;
    max: number;
    fileType: string[];
    note: string;
    value: any;
    level: number;
    relatedElement: CauHinhBieuMau[];
  }

  export interface ThuTuc {
    capDo: string;
    coQuanCoThamQuyen: string;
    donViThucHien: string;
    hoSo: string;
    ketQuaThucHien: string;
    linhVuc: string;
    loaiDon: string;
    luuY: string;
    maThuTuc: string;
    mauBieu: string;
    phamViPhucVu: string;
    quyTrinhThucHien: string;
    tenThuTuc: string;
    thoiHanGiaiQuyet: string;
    yeuCau: string;
    yeuCauTraPhi: boolean;
    _id: string;
  }

  export interface DonThaoTac {
    _id: string;
    idDon: Don;
    idBuoc: string;
    idThaoTac: string;
    idDonVi: string;
    tenDonVi: string;
    idDichVu: string;
    nguoiTao: Login.Profile;
    trangThai: 'PENDING' | 'OK' | 'NOT_OK';
    nguoiThucHien: Login.Profile;
    nguoiDuocGiao: Login.Profile;
    cauHinh: any;
    info: any;
    hanXuLy: string;
    tenThaoTac: string;
    urlFileDinhKem: string[];
    phanQuyen: boolean;
  }

  export interface ThaoTacQuyTrinh {
    tenThaoTac: string;
    _id: string;
    idDonVi: string;
    tenDonVi: string;
    soNgayXuLy?: number;
    loaiDoiTuongXuLy: string;
    cauHinh: any;
    nguoiDieuPhoiMacDinh: boolean;
    idNguoiDieuPhoiMacDinh: string;
    idNguoiDuocGiao: string;
  }
  export interface ThongTinThuTuc {
    maThuTuc?: string;
    linhVuc?: string;
    donViThucHien?: string;
    capDo?: string;
    thoiHanGiaiQuyet?: string;
    yeuCauTraPhi?: boolean;
    coQuanCoThamQuyen?: string;
    phamViPhucVu?: string;
    ketQuaThucHien?: string;
    mauBieu?: string;
    luuY?: string;
    maLePhi: string;
    tinhTienTheoSoLuong: boolean;
    choPhepGuiNhieuLan: boolean;
  }

  export interface BuocQuyTrinh {
    _id: string;
    ten: string;
    danhSachThaoTac: ThaoTacQuyTrinh[];
  }

  export interface QuyTrinh {
    _id?: string;
    danhSachBuoc: BuocQuyTrinh[];
  }

  export interface FileInfo {
    _id: string;
    filename: string;
    url: string;
    mimetype: string;
  }

  export interface BieuMau {
    _id: any;
    ten: string;
    ghiChu: string;
    moTa: string;
    mucLePhi?: number;
    donViTinh?: string;
    cauHinhBieuMau: CauHinhBieuMau[];
    quyTrinh: QuyTrinh;
    thongTinThuTuc?: ThongTinThuTuc;
    thongTinHoSo?: string;
    thongTinQuyTrinh?: string;
    thongTinYeuCau?: string;
    loaiDichVu?: 'DVMC' | 'VAN_PHONG_SO';
    fileTraLoi?: FileInfo;
    fileMau?: FileInfo;
    phamVi?: string;
    hinhThucDaoTaoId?: number;
    trangThai?: boolean;
    soNgayHen?: number;
    traKetQua?: boolean;
    cauTraLoiMacDinh?: string;
    maDichVu?: MaDichVuVps;
  }

  export interface LichSuChinhSua {
    editContent: {
      ketQuaText: string;
      ketQuaDinhKem: string[];
    };
    editDate: string;
    idNguoiSua: string;
    maNguoiSua: string;
    noiDung: string;
    tenNguoiSua: string;
    _id: string;
  }

  export interface Don {
    daTraKetQua: boolean;
    daTraLoiPhanHoi: boolean;
    noiDungPhanHoi: string;
    noiDungTraLoiPhanHoi: string;
    ketQuaDinhKem: string[];
    ketQuaText: string;
    lichSuChinhSua: LichSuChinhSua[];
    loaiDichVu?: 'DVMC' | 'VAN_PHONG_SO';
    createdAt?: string;
    trangThai?: string;
    _id?: string;
    idHoaDon?: string;
    identityCode?: string;
    soLuongThanhToan?: number;
    trangThaiThanhToan?: string;
    thongTinNguoiTao?: Login.Profile & {
      _id: string;
    };
    thongTinDichVu: {
      _id: string;
      cauHinhBieuMau: CauHinhBieuMau[];
      ten: string;
      ghiChu: string;
      quyTrinh: QuyTrinh;
      traKetQua: boolean;
      cauTraLoiMacDinh: string;
      maDichVu: MaDichVuVps;
    };
    maDon: string;
    idCoSoVatChat?: {
      active: boolean;
      info: {
        ghiChu: string;
        soCho: string;
        soPhong: string;
        tenPhong: string;
        toaNha: string;
      };

      loai: string;
      _id: string;
    };
    thongTinMuonXe?: {
      bienSoXe: string;
      createdAt: string;
      hoTen: string;
      idCoSoVatChat: string;
      idDon: string;
      idNguoiDuyet: string;
      thongTinlaiXe: {
        hoTen: string;
        sdt: string;
      }[];
      maDinhDanh: string;
      thoiGianBd: string;
      thoiGianKt: string;
      trangThai: ETrangThaiDonVps;
      updatedAt: string;
      _id: string;
    };
    thongTinMuonPhong?: {
      createdAt: string;
      hoTen: string;
      idCoSoVatChat: string;
      idDon: string;
      idNguoiDuyet: string;
      maDinhDanh: string;
      soPhong: string;
      toaNha: string;
      trangThai: ETrangThaiDonVps;
      updatedAt: string;
      _id: string;
    };
  }

  export interface TrangThaiThaoTac {
    updatedAt: string;
    hanXuLy: string;
    trangThai: string;
    _id: string;
    idThaoTac: string;
    idDonVi: string;
    tenDonVi: string;
    soNgayXuLy: number;
  }
  export interface TrangThaiBuoc {
    _id: string;
    idDichVu: string;
    idDon: string;
    nguoiTao: Login.Profile;
    idBuoc: string;
    tenBuoc: string;
    trangThai: string;
    danhSachThongKeThaoTac: TrangThaiThaoTac[];
    createdAt: string;
  }
}
