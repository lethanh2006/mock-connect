import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { ChuongTrinhDaoTao } from '../ChuongTrinhDaoTao/typing';
import type { ELoaiHocPhanCTDT } from '../constant';
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
		loaiLop?: ELoaiLopHocPhan;
		trangThai: ETrangThaiDangKyTinChi;
		maKhoaNganh?: string;

		// temp
		error?: string;
		// So sánh để tính học phí
		maNganh?: string;

		lopHocPhan?: LopHocPhan.IRecord;

		//fake
		isWaitlist?: boolean;
		trangThai?: ETrangThaiDangKyTinChi;

		dkVuotTinChiLop?: Partial<DkVuotTinChi.IRecord> | null;
		dangKyHocDuThinh?: Partial<DangKyHocDuThinh.IRecord> | null;
		createdAt?: Date;
		updatedAt?: Date;
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

	export type TThongTinCtdtHocPhan = {
		tenKhoi?: string | null;
		loai?: ELoaiHocPhanCTDT;
		khoiKienThuc?: Partial<Pick<ChuongTrinhDaoTao.IKhoiKienThuc, 'ma' | 'ten' | 'maCha'>>;
		maKhoiKienThuc?: string;
		soThuTuKy?: number;
		ten?: string;
		chuyenNganh?: { ten?: string };
		dsHocPhanTienQuyet?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null;
		dsHocPhanTruoc?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null;
		dsHocPhanSongHanh?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null;
	};

	export interface IChiTietHocPhanDangKyTinChi {
		maHocPhan?: string;
		tenHocPhan?: string;
		soTinChi?: number;
		thongTinCtdt?: TThongTinCtdtHocPhan[];
	}

	export interface AuditLog {
		_id: string;
		uId: string;
		uCode: string;
		uEmail: string;
		uName: string;
		requestType: string;
		action: string;
		logResponse?: boolean;
		ip?: string;
		data?: unknown;
		query?: unknown;
		param?: unknown;
		ua?: unknown;
		userAgent?: string;
		response?: { data?: unknown | DangKyTinChi.ILopDangKy };
		createdAt?: string;
	}

	export interface ICauHinhWaitlist {
		_id: string;
		extraSlots: number;
		dktcMultiple: boolean;
	}
}
