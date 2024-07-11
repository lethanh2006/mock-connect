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
		phanTramUuDai: number;

		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		active: boolean;
		tuDong: boolean;
	}

	export interface IUuDaiUser {
		_id: string;
		maUuDai: string;
		uuDai?: IRecord;

		userSsoId: string;
		userCode: string;
		userFullname: string;

		daSuDung: boolean;
		idDotThu?: string;
		idTransaction?: string;
		thoiGianSuDung?: string;

		maNamHoc: string;
		tenNamHoc: string;
		idDotThuTruocHocPhi: string;
		dotThuTruocHocPhi: DotThuTruocHocPhi.IRecord;
		transactionId: string;
		transaction: GiaoDich.IRecord;
		soLanApDungToiDa: number;
		tongTienUuDai: number;
		phanTramUuDai: number;

		createdAt?: string;
	}
}
