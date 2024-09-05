import type { SinhVien } from '../SinhVien/typings';
import type { ETrangThaiNopBaiTap } from './constants';

declare module BaiTap {
	export interface IRecord {
		_id: string;
		urlVideos: string[] | null;
		urlImages: string[] | null;
		urlTepDinhKem: string[] | null;
		noiDung: string;
		huongDanNop: string;
		lopHocPhanId: string;
		tenLopHocPhan: string;
		thoiGianGiao: Date;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		choPhepCapNhatSauNop: boolean;
		createdAt: Date;
		updatedAt: Date;
	}

	export interface IDanhSachGiaoBaiTap {
		_id: string;
		assignmentId: string;
		assignment: IRecord;
		maSinhVien: string;
		hoTen: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		urlVideos: string[] | null;
		urlImages: string[] | null;
		noiDungTraLoi: string;
		thoiGianTraLoi: Date;
		trangThai: ETrangThaiNopBaiTap;
	}
}
