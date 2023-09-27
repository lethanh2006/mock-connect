declare module HocKy {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		maTrinhDoDaoTao: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maHinhThucDaoTao: string;
		// hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;
		thoiGianBatDau: string;
		soTuan: number;
		isKyChinh: boolean;

		active?: boolean;
		namBatDau?: number;
		isToChucDangKyNhuCau: boolean;
		sySoDuKienBatBuoc: number;
		// sySoDuKienTuChon: number;
	}

	export interface IQuyDinhSoTinChiDangKy {
		_id: string;
		hocKyId: string;
		hocKy?: HocKy.IRecord;
		hocLucId: string;
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
	}
}
