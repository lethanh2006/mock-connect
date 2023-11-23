declare module NamHoc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		namBatDau: string;
		namKetThuc: string;
		thoiGianBatDau: string;
		maHinhThucDaoTao: string;
		hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
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
	}
}
