import type { ETrangThaiDonNghiHoc } from '../constant';
import type { ThoiKhoaBieu } from '../ThoiKhoaBieu/typing';

declare module YeuCauNghiHoc {
	export interface IRecord {
		_id: string;
		tenLopHocPhan: string;
		thoiKhoaBieuId?: string;
		sinhVienSsoId?: string;
		maSinhVien: string;
		tenSinhVien: string;
		emailSinhVien: string;
		lyDo: string;
		urlMinhChung: string | null;

		trangThai?: ETrangThaiDonNghiHoc;
		ghiChuGiangVien?: string;
		giangVienDuyetSsoId?: string;
		tenGiangVienDuyet?: string;
		thoiGianDuyet?: string | Date;
		thoiKhoaBieu?: ThoiKhoaBieu.IRecord;
	}
}
