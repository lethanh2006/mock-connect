import type { ETrangThaiDonNghiHoc } from '../constant';
import type { SinhVien } from '../SinhVien/typings';
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
		urlMinhChung: string;
		trangThai?: ETrangThaiDonNghiHoc;
		ghiChuGiangVien?: string;
		giangVienDuyetSsoId?: string;
		tenGiangVienDuyet?: string;
		thoiGianDuyet?: string | Date;
		thoiKhoaBieu?: ThoiKhoaBieu.IRecord;
	}
}
