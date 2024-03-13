import { type HocPhan } from '../HocPhan/typings';
import { type SinhVien } from '../SinhVien/typings';
import type { ETrangThaiHocPhanDangKyNhuCau, ELoaiNhuCauHocPhan } from '../constant';

declare module DangKyNhuCau {
	export interface IDotDangKy {
		_id: string;
		ten: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		// khoaNganhList?: KhoaNganh.IRecord[];
		// sinhVienList?: SinhVien.IRecord[];
	}

	export interface IDangKyNhuCau {
		_id: string;
		dotDkNhuCauId: string;
		dotDkNhuCau: IDotDangKy;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		tongSoNhuCau: number;
	}

	export interface INhuCauHocPhan {
		_id: string;
		banDkNhuCauId: string;
		banDkNhuCau: IDangKyNhuCau;
		hocPhanFk: string;
		hocPhan: HocPhan.IRecord;
		loaiNhuCauHocPhan: ELoaiNhuCauHocPhan;
	}

	export interface IHocPhanDangKyNhuCau {
		_id: string;
		phieuDangKyHocNhuCauId: string;
		phieuDangKyHocNhuCau: IDangKyNhuCau;
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		trangThai: ETrangThaiHocPhanDangKyNhuCau;
	}
}
