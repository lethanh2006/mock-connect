import { type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type HocPhan } from '../HocPhan/typings';
import { type SinhVien } from '../SinhVien/typings';

declare module DiemHocPhan {
  export interface IRecord {
    _id: string;
    sinhVienSsoId: string;
    sinhVien?: SinhVien.IRecord;
    hocPhanId: string;
    hocPhan?: HocPhan.IRecord;
    diemTongKet: number;
    diemThang4: number;
    diemChu: ELoaiDiemChu;
  }
}
