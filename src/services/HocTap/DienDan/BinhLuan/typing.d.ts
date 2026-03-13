import type { BaiDang } from '../BaiDang/typing';

declare module BinhLuan {
	export interface IRecord {
		_id: string;
		noiDung: string;
		baiDangId: string;
		ngayDang: string;
		ssoId: string;
		updatedAt: string;
		createdAt: string;
		ghiChu: string;
		thongTinNguoiDang: Omit<BaiDang.TThongTinNguoiDang, 'thoiGian'>;
		fileDinhKem?: string[];
	}
}
