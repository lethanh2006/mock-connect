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

		ghiChu?: string | null;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKeHoachTheoTuan {
		namHocId: string;
		khoaNganhIds: string[];
		tuanBatDau: number;
		tuanKetThuc: number;
		hoatDongTuanId?: string;
		ghiChu?: string | null;
	}

	export type THeadGroup = {
		title: string;
		span: number;
		isBreak?: boolean;
	};

	export type TGridHeader = {
		hocKys?: THeadGroup[];
		weeks: number[]; // Thứ tự kỳ theo năm học
		isoWeeks: number[]; // Thứ tự kỳ theo năm hành chính
		months: THeadGroup[];
		days: THeadGroup[];
	};

	export type TKeHoachData = {
		maKhoa: string;
		maNganh: string;
		maTrinhDo?: string;
		maHinhThuc?: string;
		maKhoaNganh: string;
		tenKhoaNganh: string;
		tenKhoaNganhVietTat?: string;
		keHoachList: Partial<IRecord>[];
	};
}
