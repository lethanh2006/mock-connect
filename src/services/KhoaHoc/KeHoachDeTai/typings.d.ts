import type { ELoaiDeTai } from './constants';

declare module KeHoachDeTai {
	export interface IRecord {
		_id: string;
		ten: string;
		ma: string;
		ngayBatDau: string;
		ngayKetThuc: string;
		ngayBatDauDangKy: string;
		ngayKetThucDangKy: string;
		ngayBatDauXetDuyet: string;
		ngayKetThucXetDuyet: string;
		ngayBatDauXetDuyetDeCuong: string;
		ngayKetThucXetDuyetDeCuong: string;
		ngayBatDauDeCuong: string;
		ngayKetThucDeCuong: string;
		ngayBatDauNghiemThu: string;
		ngayKetThucNghiemThu: string;
		hetHan: ETrangThaiKeHoachDeTai;
		vanBanKemTheoUrl: string[];
		mauNhanXetHoiDong: string;
		bienBanHopXetDuyet: string;
		mauSinhVienKhoa: string;
		mauSinhVienHocVien: string;
		mauGiangVien: string;
		loaiDeTai: ELoaiDeTai;
		namThucHien: number;
	}
}
