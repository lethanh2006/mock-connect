import type { LoaiHinhNCKH } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';
import { TruongThongTin } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';

declare module QuyTrinh {
	export interface IRecord {
		ten: string;
		ghiChu: string;
		moTa: string;
		maFormHienThi: string;
		maTruongHienThi: string;
		choPhepGuiNhieuLan: true;
		danhSachFormKhaiBao: IMauDon[];
		danhSachBoPhanXuLy: IBoPhanXuLy[];
		boPhanChiuTrachNhiem: IBoPhanXuLy;
		danhSachBuocXuLy: IBuocXuLy[];
		cauTrucThanhToan: {
			ten: string;
			yeuCauTraPhi: boolean;
			idNguonThu: string;
			idKhoanThu: string;
			idMucThu: string;
			thanhToanTheoSoLuong: boolean;
			maFormThamChieuSoLuongThanhToan: string;
			maTruongThamChieuSoLuongThanhToan: string;
		};
		[key: string]: any;
	}
	export interface IMauDon {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: LoaiHinhNCKH.TruongThongTin[];
		[key: string]: any;
	}
	export interface IBuocXuLy {
		ten: string;
		ma: string;
		moTa: string;
		suDungForm: true;
		maFormKhaiBao: string;
		danhSachMaBoPhanXuLy: string[];
		[key: string]: any;
	}
	export interface IBoPhanXuLy {
		ten: string;
		ma: string;
		phuongThucPhanCong: string;
		danhSachThanhVienXuLy: IThanhVienXuLy[];
		maDonVi: string;
		[key: string]: any;
	}
	export interface IThanhVienXuLy {
		ssoId: string;
		ten: string;
		ma: string;
		donVi: string;
		hocHam: string;
		hocVi: string;
		soDienThoai: string;
		email: string;
		[key: string]: any;
	}
}
