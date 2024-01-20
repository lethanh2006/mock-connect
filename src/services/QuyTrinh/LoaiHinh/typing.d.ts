import type {
	EKieuDuLieu,
	ELoaiLoaiHinh,
	ELoaiPhepToan,
	ELoaiQuyDoiGio,
	ELoaiThoiGianThucHien,
	ELoaiTinhGioThanhVien,
	ELoaiTruongThongTinTinh,
} from './constants';

declare module LoaiHinh {
	export interface Cot {
		ten: string;
		ma: string;
		kieuDuLieu: EKieuDuLieu;
		maDanhMuc: string;
		kichHoat: boolean;
		batBuoc: boolean;
		truongThongTinLienQuan: string;
		giaTriLienQuan: any;
		danhSachCot: Cot[];
		laDangMang: boolean;
		colspan: number;
		danhSachCotHienThi: string[];
		textarea: boolean;
		readonly: boolean;
		loaiDefaultValue: string;
		customDefaultValue: string;
		ghiChu: string;
		maFormLayDefaultValue: string;
		maFieldLayDefaultValue: string;
		textDisplay: ETextDisplay;
	}

	export interface TruongThongTin {
		ten: string;
		ma: string;
		ghiChu: string;
		kieuDuLieu: EKieuDuLieu;
		maDanhMuc: string;
		danhSachCot: Cot[];
		kichHoat: boolean;
		batBuoc: boolean;
		truongThongTinLienQuan: string;
		giaTriLienQuan: any;
		colspan: number;
		danhSachCotHienThi: string[];
		laDangMang: boolean;
		textarea: boolean;
		readonly: boolean;
		loaiDefaultValue: string;
		customDefaultValue: string;
		ghiChu: string;
		maFormLayDefaultValue: string;
		maFieldLayDefaultValue: string;
		textDisplay: ETextDisplay;
	}

	export interface TieuChi {
		index: number;
		maTruongThongTin: string;
		maCot: string;
		loaiPhepToan: ELoaiPhepToan;
		value: any;
	}

	export interface QuyDoiThanhVien {
		index: number;
		loaiTinhGioThanhVien: ELoaiTinhGioThanhVien;
		moTa: string;
		danhSachVaiTro: string[];
		choMoiNguoi: boolean;
		giaTri?: number;
		phanTram?: number;
		wrong?: boolean;
	}

	export interface DieuKienQuyDoi {
		index: number;
		moTa: string;
		loaiQuyDoiGio: ELoaiQuyDoiGio;
		congThucCustom: any;
		tieuChi: TieuChi[];
		gioTong: number;
		maTruongThongTinHeSo: string;
		heSo: number;
		chiaDeuChoCacThanhVien: boolean;
		heSoTheoNamHoc: boolean;
		quyDoiThanhVien: QuyDoiThanhVien[];
		active: boolean;
	}

	export interface SanPhamLienQuan {
		label: string;
		itSelf: boolean;
	}

	export interface CauHinhTruongThongTinTinh {
		loaiTruongThongTinTinh: ELoaiTruongThongTinTinh;
		label: string;
		maTruongThongTinDungSau: string;
		colspan: string;
	}

	export interface IRecord {
		danhSachCotHienThi: string[];
		_id: string;
		ten: string;
		loai: ELoaiLoaiHinh;
		kichHoat: boolean;
		khaiBao1Lan: boolean;
		hienThiRieng: boolean;
		tuDongDuyet: boolean;
		danhSachVaiTroThanhVienKhaDung: string[];
		danhSachCauHinhTruongThongTinTinh: CauHinhTruongThongTinTinh[];
		loaiThoiGianThucHien: ELoaiThoiGianThucHien;
		soLanGiaHan: number;
		cauHinhLoaiHinh: TruongThongTin[];
		createdAt: string;
		startLabel: string;
		endLabel: string;
		timelineLabel: string;
		danhSachHeSo: number[];
		danhSachDieuKienQuyDoi: DieuKienQuyDoi[];
		danhSachDieuKienQuyDoiDiem: DieuKienQuyDoi[];
		danhSachCauHinhSanPhamLienQuan: SanPhamLienQuan;
		searchKey1: string;
		searchKey2: string;
		tinhDiem?: boolean;
	}
}
