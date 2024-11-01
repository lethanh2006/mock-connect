import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { ChungChi } from '../ChungChi/typing';
import { type HocPhan } from '../HocPhan/typings';
import { type ELoaiHocPhanCTDT, type ETrangThaiHocTap } from '../constant';

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
		thoiGianDaoTao: number;
		tongSoTinChi: number;

		// Với Chương trình kế hoạch cho Khóa ngành cụ thể
		maKhoaSinhVien?: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maChuongTrinhDaoTaoChuan?: string;
		chuongTrinhDaoTaoChuan?: IRecord;

		mucTieuDaoTao: string;
		doiTuongTuyenSinh: string;
		thangDiem: string;
		quyTrinhDaoTao: string;
		dieuKienTotNghiep: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKhoiHocPhanCTDT extends IHocPhanBase {
		maChuongTrinhDaoTao: string;
		chuongTrinhDaoTao?: IRecord;
		maKhoiKienThuc: string;
		khoiKienThuc?: { ma: string; ten: string };
		maChuyenNganh?: string;
		chuyenNganh?: NganhDaoTao.IRecordCoSo;
		loaiHocPhanCtdt: ELoaiHocPhanCTDT;

		soThuTuKy?: number;
		soTinChiTuChonPhaiHoc?: number;
		ten?: string; // Tên khối chương trình tự chọn
		isTinhSoTinChiTichLuy?: boolean;
		hocPhanCtdtList?: IHocPhanTuChonCTDT[];
	}

	export interface IHocPhanTuChonCTDT extends IHocPhanBase {
		khoiHpCtId: string;
		khoiHpCt?: IKhoiHocPhanCTDT;
	}

	export interface IHocPhanBase {
		_id: string;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		// maHocPhanTienQuyet: string;
		// hocPhanTienQuyet?: HocPhan.IRecord;
		// maHocPhanTruoc: string;
		// hocPhanTruoc?: HocPhan.IRecord;
		// maHocPhanSongHanh: string;
		// hocPhanSongHanh?: HocPhan.IRecord;
		dsHocPhanTienQuyet?: THocPhanTuongQuan[];
		dsHocPhanTruoc?: THocPhanTuongQuan[];
		dsHocPhanSongHanh?: THocPhanTuongQuan[];

		createdAt?: string;
		updatedAt?: string;

		// Populate
		hoc: ETrangThaiHocTap;
		lichSuDiem?: LopHocPhan.IDiemHpSvHk[];
	}

	export type THocPhanTuongQuan = Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>;

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
		diemHpSvHk: LopHocPhan.IDiemHpSvHk;
		hocPhan: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi' | 'deCuongHienTaiId'>;
		kyHoc: Pick<HocKy.IRecord, 'ma' | 'ten'>;
		lopHocPhan: Pick<LopHocPhan.IRecord, 'ten' | 'soThuTuLop' | 'deCuong'>;
		soTinChi: number;
	};
}
