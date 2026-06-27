import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { ChungChi } from '../ChungChi/typing';
import type { ELoaiChuongTrinhDaoTao, ELoaiHocPhanCTDT, ETrangThaiHocTap } from '../constant';
import { type HocPhan } from '../HocPhan/typings';
import { KhoaNganh } from '../KhoaNganh/typing';

declare module ChuongTrinhDaoTao {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh: string;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		khoaNganh?: KhoaNganh.IRecord;
		loai: ELoaiChuongTrinhDaoTao;
		trangThai: ETrangThaiCtdt;

		thoiGianDaoTao: number;
		thoiGianDaoTaoToiDa?: number;
		tongSoTinChi: number;
		ngonNguDaoTao?: string;
		canCuId: string;
		canCu?: VanBanQuyDinh.IRecord;
		namBanHanh: number;
		// active?: boolean;
		// maLoaiChungChiList: string[];
		loaiChungChiList?: LoaiChungChi.IRecord[];
		url?: string | null;

		mucTieuDaoTao: string;
		thongTinHocPhi?: string;
		chuanDauVao: string;
		chuanDauRa: string;
		viTriLamViec: string;

		// Với Chương trình kế hoạch cho Khóa ngành cụ thể
		maKhoaNganh?: string;
		maKhoaSinhVien?: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maChuongTrinhDaoTaoChuan?: string;
		chuongTrinhDaoTaoChuan?: IRecord;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKhoiHocPhanCTDT extends IHocPhanBase {
		maChuongTrinhDaoTao?: string | null;
		chuongTrinhDaoTao?: IRecord;
		maKhoiKienThuc?: string;
		khoiKienThuc?: KhoiKienThuc.IRecord | null;
		maChuyenNganh?: string;
		chuyenNganh?: NganhDaoTao.IRecordCoSo | null;
		loaiHocPhanCtdt: ELoaiHocPhanCTDT;

		/** Số thứ tự kỳ, kỳ thực tế */
		soThuTuKy?: number;
		/** Số thứ tự kế hoạch (với chương trình kế hoạch) */
		soThuTuKyKeHoach?: number;
		// tinhChuanDauRa?: boolean;

		phamViTuChon?: PhamViTuChonHpCtdt;
		ten?: string; // Tên khối chương trình tự chọn
		soTinChiTuChonPhaiHoc?: number;
		soHocPhanTuChonPhaiHoc?: number;
		isTinhSoTinChiTichLuy?: boolean;
		// maLoaiHocPhan?: string;
		// loaiHocPhan?: HocPhan.ILoaiHocPhan;
		hocPhanCtdtList?: IHocPhanTuChonCTDT[];
	}

	export interface IHocPhanTuChonCTDT extends IHocPhanBase {
		khoiHpCtId: string;
		khoiHpCt?: IKhoiHocPhanCTDT;
	}

	export interface IHocPhanBase {
		_id: string;
		maHocPhan?: string | null;
		hocPhan?: HocPhan.IRecord | null;
		// maHocPhanTienQuyet: string;
		// hocPhanTienQuyet?: HocPhan.IRecord;
		// maHocPhanTruoc: string;
		// hocPhanTruoc?: HocPhan.IRecord;
		// maHocPhanSongHanh: string;
		// hocPhanSongHanh?: HocPhan.IRecord;
		dsHocPhanTienQuyet?: THocPhanTuongQuan[] | null;
		dsHocPhanTruoc?: THocPhanTuongQuan[] | null;
		dsHocPhanSongHanh?: THocPhanTuongQuan[] | null;

		createdAt?: string;
		updatedAt?: string;
		soTinChi?: number | null;

		// Populate
		hoc?: ETrangThaiHocTap;
		lichSuDiem?: LopHocPhan.IDiemHpSvHk[];
	}

	export type TTienTrinhKhungMinor = {
		nganhMinor?: {
			ma?: string;
			ten?: string;
			tenTiengViet?: string;
			tenTiengAnh?: string;
		};
		idPhieu?: string;
		khoiHpCtList?: IKhoiHocPhanCTDT[];
	};

	export type TTienTrinhKhung = {
		tienTrinh: IKhoiHocPhanCTDT[];
		minors: TTienTrinhKhungMinor[];
	};

	export type THocPhanTuongQuan = Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'> & { soHocPhan?: number };

	export interface IChuyenNganhMe extends NganhDaoTao.IRecordCoSo {
		active?: boolean;
		externalId?: string | null;
		dmNganhId?: string | null;
		canCuId?: string | null;
		dataPartitionCode?: string | null;
		khoiHpCtList?: IKhoiHpCt[];
		soTinChi?: number;
		mucTieu?: string;
	}

	export interface IKhoiHpCt {
		_id: string;
		ma: string;
		maHocPhan: string;
		maChuongTrinhDaoTao: string;
		maKhoiKienThuc?: string;
		maChuyenNganh?: string;
		loaiHocPhanCtdt?: string;
		isTinhSoTinChiTichLuy?: boolean;
		ten?: string | null;
		soThuTuKy?: number;
		soThuTuKyKeHoach?: number | null;
		soTinChiTuChonPhaiHoc?: number | null;
		soTinChiTuChonDaDat?: number;
		soHocPhanTuChonPhaiHoc?: number | null;
		phamViTuChon?: string;
		trangThaiLuaChon?: string;
		ghiChu?: string;
		dsHocPhanTienQuyet?: THocPhanTuongQuan[] | null;
		cheDoTienQuyet?: string;
		dsHocPhanTruoc?: THocPhanTuongQuan[];
		dsHocPhanSongHanh?: THocPhanTuongQuan[];
		chuongTrinhDaoTao?: { ma: string; ten: string };
		hocPhan?: { ma: string; ten: string; soTinChi: number };
		hocPhanCtdtList?: IKhoiHpCt[];
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IChungChiCTDT {
		_id: string;
		maChuongTrinhDaoTao: string;
		chuongTrinhDaoTao?: IRecord;
		maLoaiChungChi: string;
		loaiChungChi?: ChungChi.ILoaiChungChi;

		soChungChiPhaiDat?: number;
		danhSachChungChiCtdtCdr?: IChuanDauRa[];
	}

	export interface IChuanDauRa {
		_id: string;
		chungChiCtdtId: string;
		chungChiCtdt?: IChungChiCTDT;
		maChungChi: string;
		chungChi?: ChungChi.IRecord;
		chuanDauRa: number;
	}

	export type TTienTrinhThucTe = {
		_id?: string;
		diemHpSvHk?: LopHocPhan.IDiemHpSvHk;
		lichSuDiem?: LopHocPhan.IDiemHpSvHk[];
		hocPhan: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi' | 'deCuongHienTaiId'>;
		kyHoc: Pick<HocKy.IRecord, 'ma' | 'ten'>;
		lopHocPhan: Pick<LopHocPhan.IRecord, 'ten' | 'soThuTuLop' | 'deCuong'>;
		soTinChi: number;
		maKhoiKienThuc?: string;
		khoiKienThuc?: IKhoiKienThuc | null;
		isNgoaiCtdt?: boolean;
		hoc?: ETrangThaiHocTap;
	};

	export type TThongKePloSinhVien = {
		ma: string;
		ssoId: string;
		ten: string;

		danhSachDiemPlo: TDiemPlo[];

		danhSachChuanDauRaMucTieu: TDiemPi[];
	};

	export interface IKhoiKienThuc {
		_id: string;
		ten: string;
		ma: string;
		maKhoiKienThuc: string;
		maCha: string | null;
		soThuTu: number | null;
		cheDoYeuCauLuaChon: string;
		huongDanDangKy: string | null;
		dataPartitionCode: string | null;
		createdAt: string;
		updatedAt: string;
		khoiHpCtList?: IKhoiHocPhanCTDT[];
		khoiCha?: IKhoiKienThuc;
		khoiCon?: ChuongTrinhDaoTao.IKhoiKienThuc[];
	}

	export interface IKhoiLuaChon {
		_id: string;
		sinhVienSsoId: string;
		maKhoaNganh: string;
		maKhoiKienThuc: string;
		dataPartitionCode: string | null;
		createdAt: string;
		updatedAt: string;
		khoiKienThuc?: IKhoiKienThuc;
		maKhoiCha?: string;
	}
}
