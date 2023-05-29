declare module KhoaSinhVien {
  export interface IRecord {
    _id: string;
    ten: string;
    namHocId: string;
    namHoc?: NamHoc.IRecord;
    hinhThucDaoTaoId: string;
    hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
    namHocBatDau: number;
    createdAt?: string;
    updatedAt?: string;
  }
}
