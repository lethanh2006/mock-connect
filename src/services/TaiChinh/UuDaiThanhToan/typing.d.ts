import type { GiaoDich } from '../GiaoDich/typing';
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
		soLuong: number;

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

		idDotThu?: string;
		dotThu?: DotThuTaiChinh.Record;

		idTransaction?: string;
		transaction?: GiaoDich.IRecord;
	}
}
