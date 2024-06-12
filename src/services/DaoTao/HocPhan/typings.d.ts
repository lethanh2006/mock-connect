import { type ELoaiToChucDayHoc } from '../constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;

		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: IDeCuongHocPhan;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILoaiHocPhan {
		_id: string;
		ma: string;
		ten: string;

		isTinhDiem: boolean;
		isTinhSoTinChiDangKy: boolean;
		isTinhSoTinChiTichLuy: boolean;
		khoiTuChon?: boolean;
		khoiTotNghiep?: boolean;
	}

	export interface IDeCuongHocPhan extends ITrongSoDeCuong {
		_id: string;
		ma: string;
		maHocPhan: string;
		hocPhan: IRecord;
		// nguoiBienSoan: string;
		// ngayApDung: string;
		thoiDiemApDung?: string;
		maCanCu: string;
		canCu: VanBanQuyDinh.IRecord;
		// soTinChi: number;
		// isTinhDiem: boolean;
		mucTieuHocPhan: string;
		chuanDauRa: string;
		// noiDungTomTat: string;
		// noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;
		url?: string | null;

		thongTinTrongSo: IThongTinTrongSo[];
	}

	export interface IThongTinTrongSo {
		trongSo: number;
		hinhThucDanhGia: string;
		moTa: string;
	}

	export interface ITrongSoDeCuong {
		trongSo1?: number;
		trongSo2?: number;
		trongSo3?: number;
		trongSo4?: number;
		trongSo5?: number;
		trongSo6?: number;
		trongSo7?: number;
		trongSo8?: number;
		trongSo9?: number;
		trongSo10?: number;
	}

	export interface IGiangVienDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		nhanSuSsoId: string | null;
		hoTen?: string | null;
		chucDanh?: string | null;
		hocHam?: string | null;
		hocVi?: string | null;
		soDienThoai?: string | null;
		diaChi?: string | null;
	}

	export interface ILichTrinhChung {
		_id: string;
		tieuDe: string;
		ten: string;
		deCuongHpId: string;
		gioLyThuyet: number;
		gioBaiTapTL: number;
		gioThucHanh: number;
		gioTuHoc: number;
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuanBatDau: number;
		tuanKetThuc: number;
		noiDung: string;
		noiDungChinh: string;
		yeuCauSinhVien: string;
		ghiChu: string;
		ndTienTrinhList?: INoiDungTienTrinh[];
	}

	export interface INoiDungTienTrinh {
		_id: string;
		tienTrinhHpId: string;
		tienTrinhHp?: ITienTrinhHocPhan;
		loaiToChucDayHoc: ELoaiToChucDayHoc;
		soTiet: number;
	}

	export interface IHocLieuDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;

		idTaiLieuThuVien?: number; // Tài liệu tinh vân
		loaiTaiLieuThuVien?: 'item' | 'edata';
		maTaiLieuThuVien?: string;

		tieuDe?: string;
		moTa?: string;
		tacGia?: string;
		tenNhaXuatBan?: string;
		namXuatBan?: number;
		batBuoc: boolean;
		url?: string;
	}
}
