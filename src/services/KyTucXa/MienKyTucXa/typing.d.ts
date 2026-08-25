import { ETrangThaiMinhChung } from './constants';

declare module MienKyTucXa {
	export interface IRecord {
		_id: string;
		maSinhVien: string;
		ssoId: string;
		hoTen: string;
		maKhoa: string;
		maNganh: string;
		soDienThoai: string;
		email: string;
		maNamHoc: string;
		urlMinhChung: string;
		trangThaiMinhChung: ETrangThaiMinhChung;
		ngayDuyet?: string;
		nguoiDuyet?: string;
		ghiChuDuyet?: string;
		createdAt: string;
		updatedAt: string;
	}
}
