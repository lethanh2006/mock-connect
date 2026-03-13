declare module DotChamDiemRenLuyen {
	export interface IRecord {
		_id: string;
		tenDot: string;
		kyHoc: string;
		idBieuMau: string;
		thoiGianTiepNhanMinhChung: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianSVChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianCoVanChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianKhoaChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianBCSChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		thoiGianPhongCTSVChamDiem: {
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			_id: string;
		};
		createdAt: string;
		updatedAt: string;
		__v: number;
		[k: string]: any;
	}
}
