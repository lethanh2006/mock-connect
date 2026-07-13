declare module ToaNha {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soTang: number;
		dienTich: number;
		maHinhThucSoHuu: string;
		hinhThucSoHuu: HinhThucSoHuu.IRecord;
		namSuDung: number;
		diaChi: string;
		dienTichSan: {
			tangThu: number;
			dienTich: number;
		}[];
		maCoSo?: string;
		coSo?: CoSo.IRecord;
	}
}
