import { ETrangThaiMinhChung } from '../MienKyTucXa/constants';

declare global {
	module DotDangKyKTX {
		export interface IRecord {
			_id: string;
			tenDot: string;
			maHocKy: string;
			thoiGianBatDau: string | Date;
			thoiGianKetThuc: string | Date;
			ngayChuyenVao: string;
			ngayChuyenRa: string;
			loaiDot?: 'Theo khoa' | 'Theo danh sách';
			cauHinhKhoaToa?: ICauHinhKhoaToa[];
			hanDuyetMien?: string | null;
			maKhoaNganh: string[];
			danhSachToaNha?: string[];
			danhSachPhong?: string[];
			ghiChu: string;
			soLuongDon: number;
			trangThaiPhatHanh: ETrangThaiPhatHanh;
			targetDangKy?: number;
			batBuoc?: boolean;
			isMienKyTucXa: boolean;
			trangThaiMinhChungMien: ETrangThaiMinhChung | null;
			nguoiDuyetMien: string | null;
			ngayTaoDonMien: string | Date | null;
			ngayDuyetMien: string | Date | null;
			ghiChuDuyetMien: string | null;
		}
	}
}
