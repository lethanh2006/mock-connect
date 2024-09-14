import type { SinhVien } from '../SinhVien/typings';
import type { ETrangThaiNopBaiTap } from './constants';

declare module BaiTap {
	export interface IRecord {
		_id: string;
		urlVideos: any[];
		urlImages: any[];
		urlTepDinhKem: any[];
		noiDung: string;
		huongDanNop: string;

		lopHocPhanId: string;
		tenLopHocPhan: string;
		thoiGianGiao: Date;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		choPhepCapNhatSauNop: boolean;

		hoTenNguoiGiao: string;
		ssoIdNguoiGiao: string;
		maCanBoNguoiGiao: string;

		isQuiz: boolean;
		congBoDiemSauNop: boolean;
		congBoDapAnDungSauNop: boolean;
		khaoSatId: string;
		thoiGianLamBaiQuiz: number;

		active?: boolean;

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

		cauTraLoiId: string;
		tongDiem: number;

		createdAt: Date;
		updatedAt: Date;
	}
}
