import type { LoaiHinh } from '../QuyTrinhDong/LoaiHinh/typing';
import type { ELoaiBoLoc, ELoaiCheDoSinhVien } from './constant';

declare module CheDoSinhVien {
	export interface BoLoc {
		ten: string;
		path: string;
		loai: ELoaiBoLoc;
		danhSachGiaTri: string[];
		maModule: string;
		maDanhMuc: string;
	}

	export interface IRecord {
		_id: string;
		ten: string;
		loaiCheDoSinhVien: ELoaiCheDoSinhVien;
		danhSachCauHinhThongTin: LoaiHinh.TruongThongTin[];
		danhSachBoLoc: BoLoc[];
	}

	export interface QuyetDinhCheDoSinhVien {
		ssoId: string;
		cheDoSinhVienId: string;
		_id: string;
		thongTinQuyetDinh: any;
		danToc: string;
		hoVaTen: string;
		lop: {
			ten: string;
		};
		maSinhVien: string;
		nganh: {
			ten: string;
		};
		ngaySinh: string;
		gioiTinh: string;
		'nganh.ten': string;
		'lop.ten': string;
	}
}
