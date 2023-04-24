declare module HocKy {
  export interface IRecord {
    _id: string;
    ten: string;
    soThuTu: number;
    namHocId: string;
    namHoc?: NamHoc.IRecord;
    trinhDoDaoTaoId: string;
    trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
    hinhThucDaoTaoId: string;
    hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
    thoiGianBatDau: string;
    soTuan: number;
  }
}
