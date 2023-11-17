import type { TruongThongTin } from '@/services/LoaiHinhNCKH/typings';

declare module KhaiBaoQuyTrinh {
	export interface IRecord {
		_id: string;
		ssoId: string;
		quyTrinhId: string;
		moTa: string;
		dotQuyTrinhId: string;
		danhSachBuocXuLy: IBuocXuLy[];
		danhSachKhaiBao: {
			ten: string;
			ma: string;
			thongTinKhaiBao: any;
		}[];
		__v: 0;
		quyTrinh: {
			_id: string;
			ten: string;
			ghiChu: string;
			moTa: string;
			choPhepGuiNhieuLan: boolean;
			danhSachFormKhaiBao: IDanhSachForm[];
			danhSachBoPhanXuLy: IDonViXuLy[];
			danhSachBuocXuLy: IBuocXuLy[];
			__v: 0;
		};
		[key: string]: any;
	}
	export interface IDanhSachForm {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: TruongThongTin[];
	}
	export interface IDonViXuLy {
		ten: string;
		ma: string;
		phuongThucPhanCong: string;
		danhSachThanhVienXuLy: IThanhVienXuLy[];
	}
	export interface IBuocXuLy {
		ten: string;
		ma: string;
		maFormKhaiBao: string;
		ghiChu: string;
		maBoPhanXuLy: string;
		trangThaiTiepNhan: string;
    doiTuongDieuPhoi: string;
		coKhaiBao: boolean;
		daDienThongTin: boolean;
		laBuocHienTai: boolean;
		danhSachMaBoPhanXuLy: string[];
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
	}
}
