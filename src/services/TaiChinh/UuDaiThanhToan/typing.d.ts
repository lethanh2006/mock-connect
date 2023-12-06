import type { ELoaiUuDaiThanhToan } from './constant';

declare module UuDaiThanhToan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		moTa?: string;
		loai: ELoaiUuDaiThanhToan;

		maKhoanThuApDung: string;
		khoanThuApDung?: KhoanThu.Record;
		mucPhiApDung: number;
	}
}
