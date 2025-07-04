import { type EVaiTroBieuMau } from '../TienIch/constant';
import {
	type EHoatDongChungType1,
	type ELoaiSuKien,
	type ELoaiSuKienSinhVien,
	type EReceiverType,
	type ETrangThaiDienRa,
} from './constant';

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

	export interface IRecordSinhVien {
		_id: string;
		idDotChamDiem: string;
		idSuKien: string;
		isLamKhaoSatDangKy: boolean;
		loaiQR: ELoaiQR;
		maSv: string;
		minhChung: string;
		ssoId: string;
		suKien: IRecord;
		tenSv: string;
		thoiGian: string;
		// trangThaiThamGia: ETrangThaiThamGiaSuKien
	}

	export interface IRecord {
		_id: string;
		loaiSuKien: ELoaiSuKien;
		tenSuKien: string;
		maSuKien?: string;
		listNguoiDaThamDa?: IUser[];
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
		thoiGianBatDauDangKy?: string;
		thoiGianKetThucDangKy?: string;
		isQRDangKy?: boolean;
		isDangKy?: any;
		isQRThamGia?: boolean;
		batBuocKhaoSatDangKy?: boolean;
		batBuocKhaoSatThamGia?: boolean;
		idKhaoSatDangKy?: string;
		idKhaoSatThamGia?: string;
		thoiGianDienRa?: string;
		kinhPhi?: number;
		soLuong?: number;
		diaDiem?: string;
		ghiChu?: string;
		cauHinhMinhChungId: string;
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

	export interface ISinhVienHoatDongCTSV {
		_id: string;
		ssoId: string;
		ma: string;
		ten: string;
		maNganh: string;
		tenNganh: string;
		hoatDongCtsvId: string;
		hoatDongCtsv: IHoatDongCTSV;
		trangThaiThamGia: string;
	}

	export interface SKDaThamGia {
		_id: string;
		idSuKien: string;
		maSv: string;
		tenSv: string;
		ssoId: string;
		thoiGian: string;
		trangThaiThamGia: string;
		cauHinhMinhChungId: string;
		loaiQR: string;
		__v: 0;
		minhChung: {
			_id: string;
			diemQuyDoi: number;
			isDanhMucDiemQuyDoi: false;
			danhSachCauHinhMinhChung: [];
			doiTuongNhap: string[];
			loaiMinhChung: string;
			tenMinhChung: string;
			maMinhChung: string;
			dungChoSuKien: true;
			danhMucDiemQuyDoi: [];
			createdAt: string;
			updatedAt: string;
			__v: number;
		};
		suKien: {
			_id: string;
			loaiSuKien: string;
			tenSuKien: string;
			thoiGianBatDauDangKy: string;
			thoiGianKetThucDangKy: string;
			thoiGianBatDau: string;
			thoiGianKetThuc: string;
			diaDiem: string;
			anhBia: string;
			kyHoc: string;
			idKhaoSatDangKy: string;
			idKhaoSatCheckIn: string;
			idKhaoSatCheckOut: string;
			maSuKien: string;
		};

		[k: string]: any;
	}
	export interface IHoatDongCTSV {
		_id: string;
		phanLoaiCap1: EHoatDongChungType1;
		phanLoaiCap2: string;
		ten: string;
		maHocKy: string;
		loai: string;
		diaDiem: string;
		soLuongThamGia: number;
		cap: string;
		soLuongThamGiaGv: number;
		soLuongTiepCan: number;
		soLuongThamGiaNgoaiHocVien: number;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		danhSachDuToanKinhPhi: [];
		danhSachPhamVi: [];
		info: {
			type: string;
			refId: string;
		};
		tinh: string;
		donViPhoiHop: string;
		donViChuTri: string;
		nguonKinhPhiList: string;
		loaiDonViPhoiHop: string;
		loaidonViChuTri: string;
		thongTinPhanBoNguonKinhPhi: [];
	}
}
