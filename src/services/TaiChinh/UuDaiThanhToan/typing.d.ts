import type { GiaoDich } from '../GiaoDich/typing';

declare module UuDaiThanhToan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		moTa?: string;

		maKhoanThuApDung: string;
		khoanThuApDung?: KhoanThu.Record;
		mucPhiApDung: number;

		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		active: boolean;
		phanTramUuDai: number;
	}

	export interface IUuDaiUser {
		_id: string;
		maUuDai: string;
		uuDai?: IRecord;

		userSsoId: string;
		userCode: string;
		userFullname: string;
		createdAt: string;
	}
}
