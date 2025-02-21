declare module TruongBienMuc {
	export interface IRecord {
		_id: string;
		ma: string;
		noiDung: string;
		ghiChu: string;
		thuocTinh: TruongCon.IRecord[];
		thongTinChiMuc1: TThongTinChiMuc[];
		thongTinChiMuc2: TThongTinChiMuc[];
		createdAt?: Date;
		updatedAt?: Date;
	}

	export type TThongTinChiMuc = {
		value: string;
		chuThich: string;
	};
}
