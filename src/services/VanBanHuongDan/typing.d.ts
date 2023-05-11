import type { EDoiTuong, EPhamVi } from './constant';

declare module VanBanHuongDan {
  export interface IFile {
    index?: number;
    ten: string;
    moTa: string;
    url: string;
    _id: string;
  }

  export interface IRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
    ten: string;
    moTa: string;
    doiTuong: EDoiTuong;
    vaiTro: string;
    danhSachTep: IFile[];
    phamVi: EPhamVi;
    hinhThucDaoTaoId: number;
  }
}
