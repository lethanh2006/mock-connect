import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { BinhLuan } from '../BinhLuan/typing';

declare module BaiDang {
	export interface ILuaChon {
		_id: string;
		baiDangId: string;
		noiDung: string;
	}

	export interface IBinhChon {
		_id: string;
		luaChonId: string;
		ssoId: string;
		ma: string;
		hoTen: string;
		avatarUrl: string;
		// thongTinNguoiBinhChon?: TThongTinNguoiDang;
		ngayBinhChon?: string;
	}
	export interface IRecord {
		soDaXem: 0;
		_id: string;
		ssoId: string;
		tieuDe: string;
		noiDung: string;
		ghiChu: string;
		ngayDang: string;

		thongTinNguoiDang: Omit<TThongTinNguoiDang, 'thoiGian'>;
		danhSachDaXem: Omit<TThongTinNguoiDang, 'avatar'>[];
		danhSachBinhLuan: BinhLuan.IRecord[];

		isPublic: boolean;
		createdAt: string;
		updatedAt: string;
		lopHanhChinhId?: string;
		lopHocPhanId?: string;
		lopHanhChinh?: LopHanhChinh.IRecord;
		lopHocPhan?: LopHocPhan.IRecord;

		ghimBaiViet: boolean;
		fileDinhKem: string[] | string;

		// bổ sung bình chọn
		isBinhChon: boolean;
		isChonNhieu?: boolean;
		anDanh?: boolean;
		ngayBatDauBinhChon?: string;
		ngayKetThucBinhChon?: string;
		danhSachLuaChon?: ILuaChon[];
		danhSachBinhChon?: IBinhChon[];
		soNguoiChuaBinhChon?: number;
	}

	export type TThongTinNguoiDang = {
		ma: string;
		hoTen: string;
		ssoId: string;
		isGiaoVien: boolean;
		avatar?: string;
		thoiGian?: string;
	};
}
