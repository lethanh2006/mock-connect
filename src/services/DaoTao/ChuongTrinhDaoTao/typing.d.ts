import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type HocPhan } from '../HocPhan/typings';
import { type ETrangThaiHocTap, type ELoaiHocPhanCTDT } from '../constant';

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
		khoiKienThuc?: KhoiKienThuc.IRecord;
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
		maHocPhanTienQuyet: string;
		hocPhanTienQuyet?: HocPhan.IRecord;
		maHocPhanTruoc: string;
		hocPhanTruoc?: HocPhan.IRecord;
		maHocPhanSongHanh: string;
		hocPhanSongHanh?: HocPhan.IRecord;

		createdAt?: string;
		updatedAt?: string;

		// Populate
		hoc: ETrangThaiHocTap;
		lichSuDiem?: LopHocPhan.IRecordSinhVienLopHP[];
	}
}
