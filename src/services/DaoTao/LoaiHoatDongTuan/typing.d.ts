declare module LoaiHoatDongTuan {
  export interface IRecord {
    _id: string;
    ten: string;
    active: boolean;
    maMau: string;
    kyHieu: string;
    createdAt?: string;
    updatedAt?: string;
  }
}
