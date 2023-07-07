import { type ChuongTrinhDaoTao } from '../DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { type ELoaiDiemChu } from '../KetQuaHocTap/constant';
import {
  type EGioiTinh,
  type EHinhThucTuyenDung,
  type ENoiNgoaiTru,
  type EViTriViecLam,
} from '../constant';

declare module SinhVien {
  export interface IRecord {
    _id: string;
    anhDaiDienUrl: string;
    ma: string;
    ten: string;
    firstName: string;
    lastName: string;
    gioiTinh: EGioiTinh;
    quocTich: string;
    danToc: string;
    tonGiao: string;
    ngaySinh: string;
    cccd: string;
    noiCapCccd: string;
    ngayCapCccd: string;
    soDienThoai: string;
    email: string;
    soDienThoai2: string;
    email2: string;
    nguoiLienLac: string;
    soDienThoaiNguoiLienLac: string;
    khoaNganh: {
      khoaSinhVien: {
        ten: string;
        hinhThucDaoTao: {
          ma: string;
          danhMucHTDT: {
            ten: string;
          };
        };
        trinhDoDaoTao: {
          ma: string;
          dmTrinhDo: {
            ten: string;
          };
        };
        namHocBatDau: number;
      };
      nganh: {
        ten: string;
      };
    };

    loaiNoiSinh: string;
    quocGiaNoiSinh: string;
    tinhTpNoiSinh: string;
    quanHuyenNoiSinh: string;
    xaPhuongNoiSinh: string;

    tinhTpQueQuan: string;
    quanHuyenQueQuan: string;
    xaPhuongQueQuan: string;
    soNhaTenDuongQueQuan: string;

    tinhTpThuongTru: string;
    quanHuyenThuongTru: string;
    xaPhuongThuongTru: string;
    soNhaTenDuongThuongTru: string;

    laDoanVien: boolean;
    ngayVaoDoan: string;
    daHocLopCamTinhDang: boolean;
    laDangVien: boolean;
    ngayVaoDang: string;
    ngayVaoDangChinhThuc: string;

    loaiKhuyetTat: string;
    canNang: number;
    chieuCao: number;
    soTaiKhoanNganHang: string;
    tenNganHang: string;
    chiNhanhNganHang: string;
    soBaoHiemSinhVien: string;
    maBenhVienKhamChuaBenh: string;

    tenGiamHo: string;
    ngaySinhGiamHo: string;
    ngheNghiepGiamHo: string;
    soDienThoaiGiamHo: string;
    emailGiamHo: string;
    noiCongTacGiamHo: string;
    nguyenQuanGiamHo: string;
    diaChiGiamHo: string;
    tenChuHo: string;

    chaDaMat: boolean;
    tenCha: string;
    ngaySinhCha: string;
    soDienThoaiCha: string;
    ngheNghiepCha: string;
    emailCha: string;
    noiCongTacCha: string;
    nguyenQuanCha: string;
    diaChiCha: string;

    meDaMat: boolean;
    tenMe: string;
    ngaySinhMe: string;
    soDienThoaiMe: string;
    ngheNghiepMe: string;
    emailMe: string;
    noiCongTacMe: string;
    nguyenQuanMe: string;
    diaChiMe: string;

    tenVoChong: string;
    ngheNghiepVoChong: string;
    diaChiVoChong: string;
    soDienThoaiVoChong: string;
    emailVoChong: string;
    thongTinAnhChiEm: string;
    thongTinCacCon: string;

    khoaSinhVienId: string;
    khoaSinhVien?: KhoaSinhVien.IRecord;
    lopHanhChinhList?: LopHanhChinh.IRecord[];
    nganhId: string;
    trinhDoDaoTaoId: string;
    hinhThucDaoTaoId: string;
    chuongTrinhId: string;
    ssoId: string;
  }

  export interface IHocBongSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    ten: string;
    donViTaiTro: string;
    thoiGianTraoTangHocBong: string;
    loaiHocBongId: string;
    loaiHocBong?: LoaiHocBong.IRecord;
    giaTriHocBong: number;
  }

  export interface IKhenThuongSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    namKhenThuong: number;
    soQuyetDinhKhenThuong: string;
    danhHieuThiDuaGiaiThuongKhenThuong: string;
    capKhenThuong: string;
    loaiDanhHieuThiDuaGiaiThuongKhenThuong: string;
    phuongThucKhenThuong: string;
  }

  export interface IKyLuatSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    capQuyetDinh: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    namBiKyLuat: number;
    lyDo: string;
    loaiKyLuat: string;
  }

  export interface INoiTruSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    maKyHoc: string;
    tinhTrang: ENoiNgoaiTru;
    diaChi: string;
    thoiGianKhaiBao: string;
  }

  export interface IViecLamSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    donViTuyenDung: string;
    hinhThucTuyenDung: EHinhThucTuyenDung;
    thoiGianTuyenDung: string;
    viTriViecLam: EViTriViecLam;
    mucLuongKhoiDiem: number;
    soDienThoaiLh: string;
    email: string;
  }

  export interface IThongTinHocTapHienTai {
    chuongTrinhDaoTao: ChuongTrinhDaoTao.IRecord;
    daoTaoTuNam: string; //"2023-04-28T07:06:57.151Z"
    diemTbtl4: number;
    diemTbtl10: number;
    diemTbtlChu: ELoaiDiemChu;
    hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;
    khoaSinhVien: KhoaSinhVien.IRecord;
    loaiHocVien: string; //"Sinh viên",
    lopHanhChinh: LopHanhChinh.IRecord;
    nganhDaoTao: NganhDaoTao.IRecordCoSo;
    sinhVienNamThu: string; //"Sinh viên năm nhất"
    soNamDaoTao: number;
    trangThaiSinhVien: string; //"Đang học"
  }

  export interface ICongNoSinhVien {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: IRecord;
    dichVu: string;
    soTienPhaiNop: number;
    soTienDaNop: number;
  }
}
