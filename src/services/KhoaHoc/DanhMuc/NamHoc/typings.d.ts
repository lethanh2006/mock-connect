import type { ELoaiQueryDot } from './constant';

declare module NamHoc {
	export interface IRecord {
		tenNamHoc: string;
		loaiQueryDot: ELoaiQueryDot;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		_id: string;
	}
}
