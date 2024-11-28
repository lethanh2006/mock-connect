import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { LopHanhChinh } from '../LopHanhChinh/typing';
import type { ETrangThaisvđkHocPhanNhuCau } from './constant';

declare module HocPhanNhuCau {
	export interface IRecord {
		_id: string;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		sinhVienDangKyHocPhanNhuCauId: string;
		sinhVienDangKyHocPhanNhuCau: IPhieuDangKy;
		tinhChatHocPhan: string;
		soTinChi: number;
	}

	export interface IDotDangKy {
		_id: string;
		tenDot: string;
		maHocKy: string;
		hocKy: HocKy.IRecord;
		thoiGianBatDauDangKy: Date;
		thoiGianKetThucDangKy: Date;
		thoiGianBatDauCVHTDuyet: Date;
		thoiGianKetThucCVHTDuyet: Date;
		soHocPhanDangKyNgoaiTienTrinh: number;
	}

	export interface IPhieuDangKy {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		hoTen: string;
		maSinhVien: string;
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;
		tenLopHanhChinh: string;
		lopHanhChinh: LopHanhChinh.IRecord;
		dotDangKyHocPhanNhuCauId: string;
		dotDangKyHocPhanNhuCau: IDotDangKy;
		thoiGianDangKy: Date;
		trangThai: ETrangThaisvđkHocPhanNhuCau;
		ghiChuCVHT: string;
		cvhtSsoId: string;
		maCanBoCVHT: string;
		hoTenCVHT: string;

		soTinChiNgoaiCtdt: number;
		soTinChiTrongCtdt: number;
		soTinChiTrongTienTrinh: number;

		danhSachHocPhanDangKy: IRecord[];
	}
}
