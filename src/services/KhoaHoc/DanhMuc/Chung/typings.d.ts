import type { ELoaiDanhMucChung, ELoaiDanhMucNCKH } from './constants';

declare module DanhMucChung {
	export interface IRecord {
		_id: string;
		maDanhMuc: string;
		danhSachGiaTri: any[];
		createdAt: string;
		loaiDanhMucNckh: ELoaiDanhMucNCKH;
		maModule: ELoaiDanhMucChung;
	}
}
