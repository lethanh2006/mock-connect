declare module NhanSu {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    ngaySinh: string;
    cccd: string;
    soDienThoai: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    lopHocPhanList: LopHocPhan.IRecord[];
    avatar_path?: string;
  }
}
