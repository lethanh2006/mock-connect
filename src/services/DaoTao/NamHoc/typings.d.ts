declare module NamHoc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		thoiGianBatDau: string;
		// hinhThucDaoTaoId: string;
		// hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		// trinhDoDaoTaoId: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		soTuan: number;
		soKyChinh: number;
		soKyPhu: number;
		isKhoiTaoKeHoach: boolean;
		createdAt?: string;
		updatedAt?: string;

		//Kế hoạch năm học
		ngayBdLayYKien: Date;
		ngayKtLayYKien: Date;
		daChotKeHoachNamHoc: boolean;
		url: string | null;
		maKhoaMoiList?: string;
	}
}
