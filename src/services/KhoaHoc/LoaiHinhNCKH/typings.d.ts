import type {
	EDoiTuongLoaiHinh,
	EKieuDuLieu,
	ELoaiLoaiHinh,
	ELoaiPhepToan,
	ELoaiQuyDoiGio,
	ELoaiThoiGianThucHien,
	ELoaiTinhGioThanhVien,
	ELoaiTruongThongTinTinh,
} from './constants';

declare module LoaiHinhNCKH {
	export interface Cot {
		ten: string;
		ma: string;
		ghiChu: string;
		kieuDuLieu: EKieuDuLieu;
		maDanhMuc: string;
		kichHoat: boolean;
		batBuoc: boolean;
		truongThongTinLienQuan: string;
		danhSachTruongThongTinLienQuan: ThongTinLienQuan[];
		giaTriLienQuan: any;
		danhSachCot: Cot[];
		laDangMang: boolean;
		colspan: number;
		danhSachCotHienThi: string[];
		textarea: boolean;
		loaiHinhNckhId: string;
		loaiHinhNckh: LoaiHinhNCKH.IRecord;
		layDuLieuTu: string;
		truongLayDuLieu: string;
		textDisplay: ETextDisplay;
		readonly: boolean;
	}

	export interface ThongTinLienQuan {
		truongThongTinLienQuan: string;
		giaTriLienQuan: any;
	}

	export interface TruongThongTin {
		cheDoHienThi: ECheDoHienThi;
		ten: string;
		ma: string;
		ghiChu: string;
		kieuDuLieu: EKieuDuLieu;
		maDanhMuc: string;
		danhSachCot: Cot[];
		kichHoat: boolean;
		batBuoc: boolean;
		truongThongTinLienQuan: string;
		danhSachTruongThongTinLienQuan: ThongTinLienQuan[];
		giaTriLienQuan: any;
		colspan: number;
		danhSachCotHienThi: string[];
		laDangMang: boolean;
		textarea: boolean;
		loaiHinhNckhId: string;
		loaiHinhNckh: LoaiHinhNCKH.IRecord;
		layDuLieuTu: string;
		truongLayDuLieu: string;
		value: any;
		loaiHinhReferedId: string;
		loaiHinhReferedField: string;
		textDisplay: ETextDisplay;
		readonly: boolean;
		loaiDefaultValue: EloaiDefaultValue;
		maFormLayDefaultValue: string;
		maFieldLayDefaultValue: string;
		customDefaultValue: any;
		truongMapDanhMucDefaultValue: string;
		arrayMapDanhMucDefaultValue: any[];
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
		loaiHinhNckhLienQuanId: string;
		loaiHinhNckhLienQuan: any;
	}

	export interface CauHinhTruongThongTinTinh {
		loaiTruongThongTinTinh: ELoaiTruongThongTinTinh;
		label: string;
		maTruongThongTinDungSau: string;
		colspan?: number;
		display: boolean;
	}

	export interface CauHinhChinhSuaSauDuyet {
		choPhepChinhSuaSauDuyet: boolean;
		allowedFieldList: string[];
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
		cauHinhChinhSuaSauDuyet: CauHinhChinhSuaSauDuyet;
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
		tinhTheoTungNam: boolean;
		doiTuong: EDoiTuongLoaiHinh[];
	}
}
