declare module KeHoachNamHoc {
	export interface IRecord {
		_id: string;
		hoatDongTuan?: LoaiHoatDongTuan.IRecord;
		hoatDongTuanId: string;
		khoaNganh: KhoaNganh.IRecord;
		maKhoaNganh: string;
		lopHanhChinhId: string;
		namHocId: string;
		thuTuTuan: number;
		active: boolean;
		phienBanId: string;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKeHoachTheoTuan {
		namHocId: string;
		khoaNganhIds: string[];
		tuanBatDau: number;
		tuanKetThuc: number;
		hoatDongTuanId?: string;
	}

	export type THeadGroup = {
		title: string;
		span: number;
		isBreak?: boolean;
	};

	export type TGridHeader = {
		hocKys?: THeadGroup[];
		weeks: number[];
		months: THeadGroup[];
		days: THeadGroup[];
	};

	export type TKeHoachData = {
		maKhoa?: string;
		maNganh?: string;
		maKhoaNganh: string;
		tenKhoaNganh: string;
		keHoachList: Partial<IRecord>[];
	};
}
