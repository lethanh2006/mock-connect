import type { EDoiTuongKeHoachNCKH, ETrangThaiKeHoachNCKH } from './constants';

declare module KeHoachNCKH {
	export interface KhoiNoiDung {
		tieuDe: string;
		noiDung?: string;
		tieuDeChonTuDanhMuc: boolean;
		maDanhMucTieuDe?: string;
	}

	export interface IRecord {
		_id: string;
		doiTuong: EDoiTuongKeHoachNCKH[];
		namApDung: number;
		danhSachKhoiNoiDung: KhoiNoiDung[];
		trangThai: ETrangThaiKeHoachNCKH;
		ghiChuTiepNhan: string;
		ten: string;
		canCu?: string;
		ngayBanHanh: string;
		soQuyetDinh: string;
		fileDinhKem: string[];
	}
}
