declare module ToChucNhanSu {
  export interface IDonVi {
    _id: string;
    ten: string;
    maDonVi: string;
    laDonViThucTe: boolean;
    // soQuyetDinhThanhLap: string;
    // ngayRaQuyetDinh: string;
    donViChaId: string;
    donViCha?: IDonVi;
  }

  export interface IChucVu {
    _id: string;
    ma: string;
    ten: string;
  }

  export interface IDonViCanBoViTri {
    _id: string;
    thongTinNhanSuId: string;
    thongTinNhanSu: INhanSu;
    donViId: string;
    donVi: IDonVi;
    chucVuId: string;
    chucVu?: IChucVu;
    laChucVuChinh: boolean;
    laDonViChinh: boolean;
  }

  export interface INhanSu {
    _id: string;
    ssoId: string;
    maCanBo: string;
    hoDem: string;
    ten: string;
    // tenGoiKhac: string;
    // biDanh: string;
    email: string;
    gioiTinh: string;
    ngaySinh: string;
    // noiSinhSoNha: string;
    // noiSinhDuong: string;
    // noiSinhThanhPhoId: string;
    // noiSinhQuanId: string;
    // noiSinhXaId: string;
    // queQuanSoNha: string;
    // queQuanDuong: string;
    // queQuanThanhPhoId: string;
    // queQuanQuanId: string;
    // queQuanXaId: string;
    // hoKhauSoNha: string;
    // hoKhauDuong: string;
    // hoKhauThanhPhoId: string;
    // hoKhauQuanId: string;
    // hoKhauXaId: string;
    // noiOSoNha: string;
    // noiODuong: string;
    // noiOThanhPhoId: string;
    // noiOQuanId: string;
    // noiOXaId: string;
    sdtCaNhan: string;
    // sdtNhaRieng: string;
    // sdtCoQuan: string;
    // quocTichId: string;
    // danTocId: string;
    // tonGiaoId: string;
    // cccdCMND: string;
    // ngayCap: string;
    // noiCap: string;
    // tinhTrangHonNhan: string;
    // tenNganHang: string;
    // chiNhanh: string;
    // soTaiKhoan: string;
    // soSoBHXH: string;
    // noiCapBHXH: string;
    // ngayCapBHXH: string;
    // ngayThamGiaBHXH: string;
    // ghiChuBHXH: string;
    // maSoThue: string;
    // ngayCapMaSoThue: string;
    // donViQuanLy: string;
    // chieuCao: number;
    // canNang: number;
    // nhomMau: string;
    // tinhTrangSucKhoe: string;
    laGiangVienCoHuu: boolean;
    laChuyenVien: boolean;
    laGiangVienThinhGiang: boolean;
    // trinhDoGiaoDucPhoThongId: string;
    // trinhDoLyLuanChinhTriId: string;
    // trinhDoQuanLyHanhChinhId: string;
    // trinhDoTinHocId: string;
    // danhHieuPhongTangId: string;
    // kienThucANQP: string;
    // thuongTat: boolean;
    // phanTramThuongTat: string;
    // soTruongCongTac: string;
    // ngoaiNguId: string;
    // khungNangLucNgoaiNguId: string;
    urlAnhDaiDien?: string;
  }
}
