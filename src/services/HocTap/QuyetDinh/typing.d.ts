import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { ETrangThaiSinhVienBLTH, ETrangThaiSinhVienBaoLuu } from '../constant';

declare module QuyetDinh {
	export interface IRecord {
		_id: string;
		maHocKy?: string;
		hocKy?: HocKy.IRecord;
		loai: ELoaiQuyetDinh;
		soQuyetDinh: string;
		ngayBanHanh?: Date;
		noiDung: string;
		url?: string | null;
	}

	export interface ISinhVienBaoLuuThoiHoc {
		_id: string;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;

		trangThai: ETrangThaiSinhVienBLTH; // Trạng thái duyệt
		maDon?: string; // Mã đơn sinh viên gửi
		lyDo?: string; // Lý do không duyệt
		ghiChu?: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		//Quyết định thôi học
		// thoiGianHieuLuc?: string;
		quyetDinhThoiHoc: IRecord;
		quyetDinhThoiHocId: string;

		//Quyết định bao lưu
		soKyBaoLuu: number;
		// thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		trangThaiBaoLuu: ETrangThaiSinhVienBaoLuu;

		//Quyết định
		quyetDinhId?: string;
		soQuyetDinh?: string;
		quyetDinh?: IRecord;

		//Quay lại học
		idDonQuayLaiHoc: string;
		donQuayLaiHoc: ISinhVienQuayLaiHoc;
		quyetDinhQuayLaiHoc: IRecord;
		quyetDinhQuayLaiHocId: string;
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
