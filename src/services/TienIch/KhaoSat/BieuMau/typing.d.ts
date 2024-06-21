import { type EPhamViChuDe } from '@/services/TinTuc/constant';
import { type ELoaiDoiTuong } from '../constant';
import { type ELoaiCauHoi, type ELoaiBieuMau, type EVaiTroKhaoSat } from '../constants';

declare module BieuMau {
	export interface LuaChon {
		noiDung: string;
		dung?: boolean;
		_id: string;
	}

	export interface CauHoi {
		loai: ELoaiCauHoi;
		batBuoc: boolean;
		noiDungCauHoi: string;

		//text
		cauTraLoiKhac: boolean;

		//MultipleChoice
		luaChon: LuaChon[];

		//GridChoice
		luaChonCot: TGridItem[];
		luaChonHang: TGridItem[];

		///NumericRange
		gioiHanDuoiTuyenTinh: number;
		gioiHanTrenTuyenTinh: number;
		_id: string;
	}

	export type TGridItem = {
		noiDung: string;
		_id: string;
	};

	export interface Khoi {
		_id: string;
		tieuDe: string;
		moTa: string;
		danhSachCauHoi: CauHoi[];
	}

	export interface GeneralInfo {
		id: string;
		code: string;
		name: string;
		description: string;
		info: any;
	}

	export interface Record {
		_id: string;
		tieuDe: string;
		moTa: string;
		// phamVi: EPhamViChuDe;
		// hinhThucDaoTaoId?: number;
		// isTatCaHe?: boolean;
		// danhSachLopTinChi: GeneralInfo[];
		// danhSachLopHanhChinh: GeneralInfo[];
		// danhSachNguoiDung: GeneralInfo[];
		// danhSachKhoaHoc: GeneralInfo[];
		// danhSachNganhHoc: GeneralInfo[];
		// loaiDoiTuongSuDung: ELoaiDoiTuong[];
		coCamKet: boolean;
		noiDungCamKet: string;
		// soPhutThucHien?: number;
		// soLuotTraLoiToiDa?: number;
		// thoiGian?: string[];
		// danhSachVaiTro: string[];
		loai: ELoaiBieuMau; // "Khảo sát"
		// thoiGianBatDau: string;
		// thoiGianKetThuc: string;
		// kichHoat: boolean;
		danhSachKhoi: Khoi[];
		// doiTuong: string;
	}

	export interface ThongKeLuaChon {
		noiDungLuaChon: string;
		idLuaChon: string;
		soLuong: number;
	}

	export interface ThongKeCot {
		idCot: string;
		noiDungCot: string;
		soLuong: number;
	}

	export interface ThongKeLuaChonGrid {
		noiDungHang: string;
		idHang: string;
		thongKeCot: ThongKeCot[];
	}

	export interface ThongKeLuaChonNumeric {
		giaTriTuyenTinh: number;
		soLuong: number;
	}

	export interface ThongKeCauHoi {
		_id: string;
		noiDungCauHoi: string;
		loai: string;
		soLuongTraLoi: number;
		batBuoc?: boolean;
		ketQua: (ThongKeLuaChon | ThongKeLuaChonGrid | ThongKeLuaChonNumeric)[];
	}

	export interface ThongKeKhoi {
		_id: string;
		tieuDe: string;
		moTa: string;
		thongKeCauHoi: ThongKeCauHoi[];
	}

	export interface ThongKe {
		_id: string;
		tieuDe: string;
		moTa: string;
		loai: string;
		thongKeKhoi: ThongKeKhoi[];
	}

	export interface LuaChonBangRecord {
		_id?: string;
		idCot: string;
		idHang: string;
	}

	export interface TraLoiRecord {
		_id?: string;
		idCauHoi: string;

		listLuaChon?: string[];
		listLuaChonBang?: LuaChonBangRecord[];

		traLoiText?: string;
		luaChonTuyenTinh?: number;
		listUrlFile?: string[] | null;

		traLoiKhac?: string;
	}

	export interface IDanhGiaGiangVien {
		_id: string;
		danhSachTraLoi: BieuMau.TraLoiRecord[];
		idDot: string;
		idKhaoSat: string;
		lopHocPhanId: string;
		maLop: string;

		maGiangVien: string;
		hoTenGiangVien: string;
		giangVienSsoId: string;

		hoTen: string;
		userCode: string;
		userSsoId: string;
		vaiTro: string;

		vaiTroNguoiKhaoSat: EVaiTroKhaoSat;

		answered: boolean;
		saved: boolean;
		startedAt: Date;
		createdAt: Date;
		updatedAt: Date;
	}

	export interface IDanhGiaTietHoc {
		_id: string;
		idKhaoSat: string;
		idDot: string;
		danhSachTraLoi: BieuMau.TraLoiRecord[];

		hoTen: string;
		userId: string;
		userSsoId: string;

		createdAt: Date;
		updatedAt: Date;
	}

	export type TPostDanhGiaTietHoc = {
		idTkb: string;
		cauTraLoi: Pick<IDanhGiaTietHoc, 'danhSachTraLoi' | 'idDot' | 'idKhaoSat'>;
	};
}
