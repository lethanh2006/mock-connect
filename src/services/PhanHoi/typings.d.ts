declare module PhanHoi {
  export interface IRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
    idDonDVMC: string;
    maSv: string;
    ssoId: string;
    noiDungPhanHoi: string;
    noiDungTraLoiPhanHoi: string;
    daTraLoiPhanHoi: boolean;
    maChuyenVien: string;
    loaiPhanHoi: string;
    thoiGianTraLoi: string;
    urlPhanAnh?: string;
  }
}
