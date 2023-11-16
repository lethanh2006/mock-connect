import type { ETrangThaiSinhVienBLTH } from '../constant';

declare module QuyetDinh {
	export interface IRecord {
		_id: string;
		soQuyetDinh: string;
		noiDung: string;
		loai: ELoaiQuyetDinh;
		thoiGianBatDau: date;
		thoiGianKetThuc: date;
		url: string | null;
	}

	export interface ISinhVienBaoLuuThoiHoc {
		_id: string;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: KhoaNganh.IRecord;

		trangThai: ETrangThaiSinhVienBLTH;
		maDon?: string;
		soQuyetDinh?: string;
		quyetDinh?: IRecord;
		lyDo?: string;

		//Quyết định thôi học
		thoiGianHieuLuc?: string;

		//Quyết định bao lưu
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	}
}
