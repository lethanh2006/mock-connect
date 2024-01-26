import { LoaiHinhNCKH, TruongThongTin } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';

declare module DotQuyTrinh {
	export interface CauHinhThoiGianDot {
		maBuoc: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		guiThongBao: boolean;
		tuDongChuyenBuocKhiHetHan: boolean;
	}
	export interface IRecord {
		_id: string;
		ten: string;
		quyTrinhId: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		__v: number;
		danhSachCauHinhThoiGianDot: CauHinhThoiGianDot[];
		[key: string]: any;
	}
}
