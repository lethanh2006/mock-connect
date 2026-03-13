import type { ELoaiThoiGianThucHien } from '../LoaiHinhNCKH/constants';
import type { LoaiHinhNCKH } from '../LoaiHinhNCKH/typings';
import type { ETrangThaiSanPham, ETrangThaiYeuCauQuyDoiGio, EVaiTroThanhVienNckh } from './constants';

declare module SanPhamNCKH {
	export interface ThanhVienNCKH {
		index: number;
		ssoId?: string;
		danhSachVaiTro: string[];
		hoVaTen: string;
		hoDem: string;
		ten: string;
		maCanBo: string;
		maDinhDanh: string;
		hocHam: string;
		hocVi: string;
		donVi: string;
		maDonVi: string;
		email: string;
		soDienThoai: string;
		ghiChu: string;
		tongGio?: number;
		tongDiem?: number;
		cmtCccd: string;
		vaiTro: EVaiTroThanhVienNckh;
	}

	export interface TimeConfig {
		loaiThoiGianThucHien: ELoaiThoiGianThucHien;
		start?: string;
		end?: string;
		timeline?: string;
	}

	export interface ThongTinGio {
		index: number;
		moTa: string;
		soGio: number;
		heSo: number;
		tongGio: number;
		ghiChu: string;
	}

	export interface KetQuaTinhGioThanhVien {
		ssoId: string;
		tongGio: number;
		danhSachThongTinGio?: ThongTinGio[];
		ghiChuTiepNhan?: string;
	}

	export interface KetQuaQuyDoiGio {
		namHocId: string;
		danhSachKetQuaTinhGioThanhVien: KetQuaTinhGioThanhVien[];
		namHocId: string;
		namHoc: NamHoc.IRecord;
		trangThaiTiepNhan: ETrangThaiYeuCauQuyDoiGio;
		ghiChuTiepNhan: string;
		danhSachKetQuaTinhGioThanhVien: KetQuaTinhGioThanhVien[];
	}

	export interface YeuCauQuyDoiGio {
		namHocId: string;
		namHoc: NamHoc.IRecord;
		trangThaiTiepNhan: ETrangThaiYeuCauQuyDoiGio;
		ghiChuTiepNhan: string;
		danhSachKetQuaTinhGioThanhVien: KetQuaTinhGioThanhVien[];
	}

	export interface IRecord {
		createdAt: string;
		_id: string;
		nguoiKhaiBao: ThanhVienNCKH;
		soLuongThanhVien: number;
		danhSachMinhChung: string[];
		danhSachThanhVien: ThanhVienNCKH[];
		loaiHinhNckhId: string;
		loaiHinhNckh: LoaiHinhNCKH.IRecord;
		thongTinThoiGian: TimeConfig;
		thongTinKhaiBao: LoaiHinhNCKH.TruongThongTin[];
		trangThaiSanPham: ETrangThaiSanPham;
		ghiChuTiepNhan: string;
		danhSachKetQuaQuyDoiGio: KetQuaQuyDoiGio[];
		danhSachKetQuaQuyDoiDiem: KetQuaQuyDoiGio[];
		danhSachYeuCauQuyDoiGio: YeuCauQuyDoiGio[];
		danhSachYeuCauQuyDoiDiem: YeuCauQuyDoiGio[];
		dotId: string;
		[x: string]: any;
	}

	interface DataThongKe {
		danhSachCotHienThi: string[];
		gioQuyDoi: SanPhamNCKH.KetQuaTinhGioThanhVien;
		nguoiKhaiBao: SanPhamNCKH.ThanhVienNCKH;
		thongTinKhaiBao: any[];
		loaiHinhNckhId: string;
		trangThaiSanPham: ETrangThaiSanPham;
		_id: string;
		danhSachThanhVien: SanPhamNCKH.ThanhVienNCKH[];
	}
}
