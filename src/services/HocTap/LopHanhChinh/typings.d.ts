declare module LopHanhChinh {
  export interface IRecord extends INhanVienSinhVien {
    _id: string;
    ten: string;
    nhanSuSsoId: string5;
    createdAt: string;
    updatedAt: string;
    khoaSinhVienId: string;
    nganhId: string;
    khoaSinhVien: KhoaSinhVien.IRecord;
    nganh: NganhHoc.IRecord;
  }

  export interface INhanVienSinhVien {
    diemTichLuyLonNhat: number;
    diemTichLuyNhoNhat: number;
    diemTichLuyTB: number;
    sinhVienList: ISinhVienDiemHanhChinh[];
  }

  export interface ISinhVien extends Login.Profile {
    cccd: string;
    chuongTrinhId: string;
    createdAt: string;
    email: string;
    hinhThucDaoTaoId: string;
    khoaSinhVienId: string;
    ma: sv001;
    nganhId: string;
    ngaySinh: string;
    soDienThoai: string;
    ssoId: string;
    ten: string;
    trinhDoDaoTaoId: string;
    updatedAt: string;
    _id: string;
    LopHcSvModel: any;
  }
}
