import { type ECapHanhChinh } from '../constant';

declare module DonViHanhChinh {
  export interface IRecord {
    _id: string;
    tenDonVi: string;
    cap: number;
    ma: number;
    maDonViTrucThuoc: string;
    createdAt: string;
    updatedAt: string;
    capHanhChinh: ECapHanhChinh;
  }
  export interface IDataInit {
    tinhTp?: string;
    quanHuyen?: string;
    xaPhuong?: string;
    soNhaTenDuong?: string;
  }
}
