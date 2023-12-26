import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type HocPhan } from '../HocPhan/typings';
import type { SinhVien } from '../SinhVien/typings';
import type {
	ELoaiHocPhanDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
	ETrangThaiHocPhanDangKyTinChi,
	ETrangThaiSinhVienDKTinChi,
} from './constant';

declare module DangKyTinChi {
	export interface IDotDangKy {
		_id: string;
		ten: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		kichHoat: boolean;
		tinhChatDangKy: ETinhChatDangKyTC;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;

		allowNhuCau: boolean;
		allowTienTrinh: boolean;
		allowHocLai: boolean;
		allowHocCaiThien: boolean;
		allowHocVuot: boolean;
		allowChuaTheoTienTrinh: boolean;
		allowNgoaiChuongTrinh: boolean;
	}

	export interface IPhieuDangKy {
		_id: string;
		idDotDangKyTinChi: string;
		sinhVienSsoId: string;
		// sinhVien?: SinhVien.IRecord;
		maHocKy: string;
		// hocKy?: HocKy.IRecord;
		soTinChiDaDk: number;
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
		soTinChiToiDaSongNganh: number;
		maSvHk: string;
		lopHpSvList: LopHocPhan.IRecordSinhVienLopHP[];
	}

	export interface ISinhVienDotDangKy {
		_id: string;
		dotDangKyTinChiId: string;
		dotDangKyTinChi: IDotDangKy;
		sinhVienSsoId: string;
		sinhVien: Partial<SinhVien.IRecord>;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		ghiChu?: string;
		trangThaiSvDangKyTinChi: ETrangThaiSinhVienDKTinChi;

		soTinChiToiThieu?: number;
		soTinChiToiDa?: number;
		soTinChiToiDaSongNganh?: number;

		hoTen?: string;
		maSinhVien?: string;
	}

	export interface ILopDangKy extends LopHocPhan.IRecord {
		soTinChi: number;
		loai?: ELoaiHocPhanDangKyTinChi;
		trangThai: ETrangThaiDangKyTinChi;
		maKhoaNganh?: string;

		// temp
		error?: string;
	}

	export interface IHocPhanDangKy {
		maHocPhan: string;
		tenHocPhan: string;
		soTinChi: number;
		nhuCau: boolean;
		loai: ELoaiHocPhanDangKyTinChi;
		trangThai: ETrangThaiHocPhanDangKyTinChi;
		hpTienQuyet?: Partial<HocPhan.IRecord>;
		hpHocTruoc?: Partial<HocPhan.IRecord>;
	}
}
