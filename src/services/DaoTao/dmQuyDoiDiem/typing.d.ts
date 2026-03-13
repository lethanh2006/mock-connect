import { type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';

declare module dmQuyDoiDiem {
	export interface IRecord {
		_id: string;
		diemFrom: number;
		diemTo: number;
		diemThang4: number;
		diemChu: ELoaiDiemChu;
	}
}
