import type { ETinhTrangSucKhoe } from './constant';

declare module KhaiBaoSucKhoe {
	export interface IRecord {
		_id: string;
		dotKhamSucKhoeId: string;
		dotKhamSucKhoe: IDotKhaiBaoSucKhoe;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		tinhTrangSucKhoe: ETinhTrangSucKhoe;
	}
	export interface IDotKhaiBaoSucKhoe {
		_id: string;
		ten: string;
		maHocKy: string;
		tenHocKy: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		danhSachKhoaNganh: KhoaNganh.IRecord;
		trangThai: ETrangThaiKhaiBaoSucKhoe;
	}
}
