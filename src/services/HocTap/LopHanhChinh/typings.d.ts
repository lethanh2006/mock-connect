declare module LopHanhChinh {
  export interface IRecord {
    _id: string;
    ten: string;
    khoaSinhVienId: string;
    khoaSinhVien?: KhoaSinhVien.IRecord;
    nganhId: string;
    nganh?: NganhDaoTao.IRecordCoSo;
    siSo: number;
    nhanSuSsoId?: string;
    giangVien?: ToChucNhanSu.INhanSu;
    sinhVienList?: SinhVien.IRecord[];
    createdAt?: string;
    updatedAt?: string;
  }
}
