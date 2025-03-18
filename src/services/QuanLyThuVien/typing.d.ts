import type { NganhDaoTao } from '../DanhMucHeThong/Nganh/typings';
import type { SinhVien } from '../SinhVien/typings';
import type { ELoaiDotQuanLyThuvien, ETrangThaiNopThuVien } from './constant';

declare module QuanLyThuVien {
	export interface IQuanLyDot {
		_id: string;
		tenDot: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		loai: ELoaiDotQuanLyThuvien;
		ghiChu: string;

		thoiGian: any;
	}

	export interface IQuanLyDanhSachNop {
		_id: string;
		idDot: string;
		dot: IQuanLyDot;
		tenDeTai: string;
		thoiGianNop: Date;
		trangThai: ETrangThaiNopThuVien;
		soLuuChieu: string;
		loai: ELoaiDotQuanLyThuvien;
		maSinhVien: string;
		ssoId: string;
		sinhVien: SinhVien.IRecord;
		hoTenTacGia: string;
		chucDanh: string;
		hocVi: string;
		maNganh: string;
		nganh: NganhDaoTao.IRecordCoSo;
		noiCongTac: string;
		nguoiHuongDan: string;

		urlTaiLieu: any;
		urlTomTat: any;
		urlTaiLieuMinhChung: any;
		idTaiLieu: string;
		idTomTat: string;
		idTaiLieuMinhChung: string;

		//fake interface
		commit: boolean;
	}

	export interface settingThuVien {
		luanAn: number;
		luanVan: number;
		khoaLuan: number;
	}

	export interface IVaoRaThuVien {
		_id: string;
		ngay: number;
		thang: number;
		nam: number;
		buoi: EBuoiRaVaoThuVien;
		thoiGianCheckIn: Date;
		trangThaiCheckIn: boolean;
		trangThaiCheckOut: boolean;
		thoiGianCheckOut: Date;

		maSv: string;
		hoTen: string;
		ssoId: string;
		gioiTinh: string;
		soDienThoai: string;
		maKhoaSinhVien: string;
		tenKhoaSinhVien: string;
		maNganh: string;
		tenNganh: string;
		ngaySinh: Date;
	}

	export type TThongKeVaoRa = {
		thang: number;
		nam: number;
		totalCI: number;
		totalCO: number;
	};

	export interface IThongKeCheckInTop {
		_id: string;
		hoTen: string;
		maSv: string;
		total: number;
	}

	export interface ICauHinhVaoRaThuVien {
		thu: number;
		thoiGianMoCuaBuoiSang: Date;
		thoiGianDongCuaBuoiSang: Date;
		thoiGianMoCuaBuoiChieu: Date;
		thoiGianDongCuaBuoiChieu: Date;
		thoiGianMoCuaBuoiToi: Date;
		thoiGianDongCuaBuoiToi: Date;
	}
}
