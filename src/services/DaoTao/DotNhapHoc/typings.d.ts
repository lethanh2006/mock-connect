import type { SinhVien } from '@/services/SinhVien/typings';
import type { KhoaSinhVien } from '../KhoaSinhVien/typings';
import type { QuyetDinh } from '@/services/DanhMucHeThong/QuyetDinh/typing';
import type { ELoaiQuyetDinh } from '@/services/DanhMucHeThong/constant';
import type { HocKy } from '@/services/HocKy/HocKy/typing';
import type { EGiayToCanNopType } from './constant';

declare module DotNhapHoc {
	export interface IRecord {
		_id: string;
		maKhoaSinhVien: string;
		khoaSinhVien: KhoaSinhVien.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		ten: string;
		soThuTu: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		quyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		danhSachGiayToNhapHoc?: IGiayToCanNopNhapHoc[];

		//fakeinterface Quyết định
		maHocKy?: string;
		loai: ELoaiQuyetDinh;
		soQuyetDinh: string;
		ngayBanHanh?: Date;
		noiDung: string;
		url?: string | null;
	}

	export interface IGiayToCanNopNhapHoc {
		id?: string;
		ten: string;
		huongDan: string;
		urlFileHuongDan: string;
		soLuong: number;
		type: EGiayToCanNopType[];
		required?: boolean;
	}

	export interface ISinhVienDotNhapHoc {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		idDotNhapHoc: string;
		dotNhapHoc: DotNhapHoc.IRecord;
		doiTuongDauVao: string;
		ketQuaTuyenSinh: string;
		quyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		ngayNhapHoc: Date;
	}
}
