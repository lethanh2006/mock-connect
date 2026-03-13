declare module DotThuTruocHocPhi {
	export interface IRecord {
		_id: string;
		ten: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		maKhoanThu: string;
		khoanThu: KhoanThu.IRecord;
		uuDaiId: string;
		uuDai: UuDaiThanhToan.IRecord;
		maNamHoc: string;
		tenNamHoc: string;
		soLanToiDaApDung: number;
		soTinChiNhanUuDai: number;
	}
}
