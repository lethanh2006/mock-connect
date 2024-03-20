import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { ETrangThaiSinhVienBLTH, ETrangThaiSinhVienBaoLuu } from '../constant';

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
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;

		trangThai: ETrangThaiSinhVienBLTH; // Trạng thái duyệt
		maDon?: string; // Mã đơn sinh viên gửi
		lyDo?: string; // Lý do không duyệt
		ghiChu?: string;

		//Quyết định thôi học
		thoiGianHieuLuc?: string;
		quyetDinhThoiHoc: IRecord;
		quyetDinhThoiHocId: string;

		//Quyết định bao lưu
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		trangThaiBaoLuu: ETrangThaiSinhVienBaoLuu;

		//Quyết định
		quyetDinhId?: string;
		soQuyetDinh?: string;
		quyetDinh?: IRecord;

		//Quay lại học
		idDonQuayLaiHoc: string;
		donQuayLaiHoc: ISinhVienQuayLaiHoc;
	}

	export interface ISinhVienQuayLaiHoc {
		_id: string;
		ghiChu: string;
		hoTen: string;
		lyDo: null;
		maDon: null;
		maKhoaNganh: string;
		maSinhVien: string;
		quyetDinhId: stirng;
		quyetDinh: IRecord;
		sinhVienSsoId: string;
		trangThai: ETrangThaiSinhVienDot;
	}
}
