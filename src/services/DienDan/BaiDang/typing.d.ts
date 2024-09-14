import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { BinhLuan } from '../BinhLuan/typing';

declare module BaiDang {
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
