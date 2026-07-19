declare module DanhMucChung {
	export interface IRecord {
		_id: string;
		maLoai: string;
		ma: string;
		ten: string;
		anh?: string;
	}

	export interface ITienIch {
		maDanhMucTienIch: string;
	}
}
