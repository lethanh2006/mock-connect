import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';

declare module BaiDang {
	export interface IRecord {
		soDaXem: 0;
		_id: string;
		ssoId: string;
		tieuDe: string;
		noiDung: string;
		ghiChu: string;
		ngayDang: string;

		danhSachDaXem: {
			ma: string;
			hoTen: string;
			ssoId: string;
			thoiGian: string;
			isGiaoVien: boolean;
		}[];
		danhSachBinhLuan: BinhLuan.IRecord[];

		thongTinNguoiDang: {
			ma: string;
			hoTen: string;
			ssoId: string;
			avatar: string;
			isGiaoVien: boolean;
		};
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
}
