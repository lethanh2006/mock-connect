declare module HinhThucThi {
	export interface IRecord {
		_id: string;
		ten: string;
		tenHinhThuc?: string;
		doiTuongCham?: EDoiTuongChamThi;
		yeuCauSinhPhach?: boolean;
	}
}
