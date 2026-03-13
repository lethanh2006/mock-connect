import type { ELoaiPhanHoi } from '../PhanHoi/constant';

declare module CauHoiThuongGap {
  export interface IRecord {
    _id: string;
    createdAt: string;
    updatedAt: string;
    cauHoi: string;
    cauTraLoi: string;
    loaiCauHoi: ELoaiPhanHoi.DVMC;
  }
}
