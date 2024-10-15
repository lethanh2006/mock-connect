import type { ELoaiThongTinXemSau } from './constant';

declare module XemSau {
	export interface IRecord {
		_id: string;
		userSsoId: string;
		sourceId: string;
		loaiThongTin: ELoaiThongTinXemSau;
		idChuDe: string | null;
		thongTin: any;
	}
}
