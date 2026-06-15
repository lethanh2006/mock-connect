import { ChuongTrinhDaoTao } from '../ChuongTrinhDaoTao/typing';
import { ETrangThaiDangKyChuyenNganh } from '../DangKyChuyenNganh/constant';
import { DangKyChuyenNganh } from '../DangKyChuyenNganh/typing';
import { ELoaiPhieuDkCtdt } from './constant';

export declare module PhieuDkCtdt {
	export type TCommentType = 'ghiChu' | 'ghiChuCVHT' | 'ghiChuBoMon' | 'ghiChuQldt';

	export interface HocPhanDkCtdt extends ChuongTrinhDaoTao.THocPhanTuongQuan {
		trangThaiKqht: string;
		diem?: string;
	}

	export interface KhoiHocPhanDkCtdt {
		hocPhanChinh: HocPhanDkCtdt;
		soThuTuKy: number;
		dsHocPhanTienQuyet?: ChuongTrinhDaoTao.THocPhanTuongQuan[];
		hocPhanThayTheList?: HocPhanDkCtdt[];
	}
	export interface HpTuChonList {
		hocPhanCtdtId?: string;
		maHocPhan?: string;
		tenHocPhan?: string;
		soTinChi?: number;
	}

	export interface UpdatePhieuDkCtdtMeDto {
		_id: string;
		tenChuongTrinh?: string;
		mucTieuLyDo?: string;
		ten: string;
		ma: string;
		nganh: string;
		lop: string;
		loai?: ELoaiPhieuDkCtdt;
		gpa: number;
		ngaySinh: string;
		gioiTinh: string;
		maDonVi?: string;
		khoiHpCtList?: KhoiHocPhanDkCtdt[];
		hpTuChonList?: HpTuChonList[];
		maChuyenNganh?: string;
		maCtdt?: string;
		email: string;
		sinhVienSsoId?: string;

		tenDonViPhuTrach?: string;
		maDonViPhuTrach?: string;
		idDonViPhuTrach?: string;
		
		ssoIdCoVanHocTapChinh?: string;
		hoTenCoVanHocTapChinh?: string;
		emailCoVanHocTapChinh?: string;
		maCoVanHocTapChinh?: string;

		ssoIdCoVanHocTapPhu?: string;
		hoTenCoVanHocTapPhu?: string;
		emailCoVanHocTapPhu?: string;
		maCoVanHocTapPhu?: string;
		soDienThoai: string;

		trangThai: ETrangThaiDangKyChuyenNganh;
		trangThaiDuyetCVHT: ETrangThaiDangKyChuyenNganh;
		trangThaiDuyetKhoaBoMon: ETrangThaiDangKyChuyenNganh;
		trangThaiDuyetQldt: ETrangThaiDangKyChuyenNganh;

		ghiChu?: string;
		ghiChuCVHT?: string;
		ghiChuBoMon?: string;
		ghiChuQldt?: string;
		
		hasDiscussedWithAdvisor?: boolean;
		dot?: DangKyChuyenNganh.IDotDangKy;
		ngayNop?: string;
		ctdt?: ChuongTrinhDaoTao.IRecord;
		chuyenNganh?: ChuongTrinhDaoTao.IChuyenNganhMe;
		updatedAt: Date;
	}
}
