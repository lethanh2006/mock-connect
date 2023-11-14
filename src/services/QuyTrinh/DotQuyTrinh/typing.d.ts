import { LoaiHinhNCKH, TruongThongTin } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';

declare module DotQuyTrinh {
	export interface IRecord {
		_id: string;
		ten: string;
		quyTrinhId: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		__v: number;

		[key: string]: any;
	}
}
