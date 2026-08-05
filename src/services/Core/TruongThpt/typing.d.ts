declare module TruongThpt {
	export interface ITinhTP {
		_id: string;
		tenTinhTP: string;
		maTinhTP: string;
	}

	export interface IRecord {
		_id: string;
		diaChiTruong?: string;
		isDTNC?: boolean;
		khuVuc?: string;
		maTinhTP: string;
		maTruong: string;
		tenTinhTP: string;
		tenTruong: string;
		truongChuyen?: boolean;
		createdAt?: string;
		updatedAt?: string;
	}
}
