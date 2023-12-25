import { type ELoaiNhapTayPhieuDiem, type ETrangThaiChamDiem } from '../constants';

declare module PhieuDiemRenLuyen {
	export interface IRecord
		extends Pick<Login.Profile, 'avatar_path' | 'id' | 'name' | 'gioi_tinh' | 'ngay_sinh' | 'email' | 'so_dien_thoai'> {
		ketQua?: IKetQua;
	}

	export interface ICauHinhPhieu {
		_id: string;
		ten: string;
		danhSachTieuChi?: ITieuChiChamDiem[];
	}

	export interface ITieuChiChamDiem {
		_id: string;
		tieuDe: string;
		danhSachNoiDung?: INoiDungChamDiem[];
	}

	export interface INoiDungChamDiem {
		_id: string;
		STT: string; // '1.1';
		tieuDe: string; // 'Ý thức và thái độ trong học tập';
		maNoiDung: string; // 'GBfrN1mkZ1wGCvmP';
		loaiNoiDung: 'Nhập tay' | 'Hệ thống';
		loaiNhapTay: ELoaiNhapTayPhieuDiem;
		tapGiaTri: number[]; //[0, 3];

		// Populate cho từng kết quả
		diemHeThong?: number;
	}

	export interface IDataTable extends Partial<INoiDungChamDiem> {
		diemQuyDinh?: string;
		diemToiDa?: string;
		// sinhVienDanhGia?: number;
		// tapTheDanhGia?: number;
		// cvhtDanhGia?: number;
		// diemHeThong?: number;

		index: number;
		children?: IDataTable[];
	}

	export interface IKetQua extends IDiemCham {
		_id: string;
		daLuu: boolean;
		username: string;
		hoTen: string;
		idLopHanhChinh?: string;
		idDotChamDiem: string;
		phieuDiem?: ICauHinhPhieu;

		trangThaiChamSinhVien: ETrangThaiChamDiem;
		trangThaiChamCanSu: ETrangThaiChamDiem;
		trangThaiChamCoVan: ETrangThaiChamDiem;
	}

	export interface IDiemCham {
		diemChamCanSu?: TChiTietDiem[];
		diemChamCoVan?: TChiTietDiem[];
		diemChamSinhVien?: TChiTietDiem[];
	}

	export type TChiTietDiem = {
		maNoiDung: string; //"1.1",
		diem: number;
	};

	export interface IKetQuaTamThoi extends IDiemCham {
		diemChamCanSu?: Record<string, number | undefined>;
		diemChamCoVan?: Record<string, number | undefined>;
		diemChamSinhVien?: Record<string, number | undefined>;
		diemHeThong?: Record<string, number | undefined>;
	}
}
