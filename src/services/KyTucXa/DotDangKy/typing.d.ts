declare module DotDangKyKTX {
	export interface IRecord {
		_id: string;
		tenDot: string;
		maHocKy: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
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
		isMienKyTucXa?: boolean;
	}
}
