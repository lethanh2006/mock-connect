import type { ELoaiPhanHoi } from './constant';

declare module PhanHoi {
  export interface IRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
    idDonDVMC: string;
    noiDungPhanHoi: string;
    noiDungTraLoiPhanHoi: string;
    daTraLoiPhanHoi: boolean;
    maChuyenVien: string;
    loaiPhanHoi: ELoaiPhanHoi;
  }
}
