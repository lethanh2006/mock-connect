import { type ELoaiDanhMucChung } from './constant';

declare module DanhMucDiemRenLuyen {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		ghiChu?: string;
		loai: ELoaiDanhMucChung;
		idCha?: string;
	}
}
