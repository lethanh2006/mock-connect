declare module SinhVien {
  export interface IRecord {
    _id: string;
    anhDaiDienUrl: string;
    ma: string;
    ten: string;
    firstName: string;
    lastName: string;
    quocTich: string;
    danToc: string;
    tonGiao: string;
    cccd: string;
    noiCapCccd: string;
    ngayCapCccd: string;
    loaiNoiSinh: string;
    quocGiaNoiSinh: string;
    tinhTpNoiSinh: string;
    email: string;
    gioiTinh: string;
    khoaSinhVienId: string;
    nganhId: string;
    trinhDoDaoTaoId: string;
    hinhThucDaoTaoId: string;
    lopHanhChinhList: { ten: string }[];
    khoaSinhVien: { ten: string };
    nganh: {
      ten: string;
      tenTiengAnh: string;
    };
    ngaySinh: string;
    soDienThoai: string;
  }
}
