import { type EVaiTroBieuMau } from '../TienIch/constant';
import { type ESuKienType, type ETrangThaiDienRa, type ELoaiSuKienSinhVien, type EReceiverType } from './constant';

declare module SuKien {
	export interface ThongTinSukien {
		_id: string;
		tenSuKien: string;
		maSuKien: string;
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	}
	export interface ThongKeTheoNam {
		suKienChuaDienRa: number;
		suKienDangDienRa: number;
		suKienDaDienRa: number;
		thongKe?: ThongKeTheoSuKien[];
	}
	export interface ThongKeTheoSuKien {
		tenSuKien: string;
		tongNguoiDaThamDu: number;
		tongusers: number;
		danhSach?: SuKien.IUser[];
	}

	export interface IRecord {
		_id: string;
		loaiSuKien: ESuKienType;
		tenSuKien: string;
		maSuKien?: string;
		listNguoiDaThamDa?: IUser[];
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		thoiGianDienRa?: string;
		kinhPhi?: number;
		soLuong?: number;
		diaDiem?: string;
		ghiChu?: string;
		trangThai?: ETrangThaiDienRa;
		loaiSuKienSinhVien?: ELoaiSuKienSinhVien;
		filter?: {
			roles?: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopHocPhan: string;
		};
		receiverType: EReceiverType;
		topics?: string[];
		users?: IUser[];
		roles?: EVaiTroBieuMau[];
	}
	export interface IUser {
		code: string;
		firstname: string;
		lastname: string;
		vaiTro?: EVaiTroBieuMau;
		thamGia?: boolean;
		fullname?: string;
	}
}
