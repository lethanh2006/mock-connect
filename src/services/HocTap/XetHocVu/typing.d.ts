import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { ELoaiXuLyKQHT, ETrangThaiDuyetXuLyKqht, EYKienCoVanHocTap } from '../constant';

declare module XetHocVu {
	export interface IRecord {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: KhoaNganh.IRecord;
		tenLopHanhChinh: string;
		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;

		loaiXuLy: ELoaiXuLyKQHT;
		lyDo: string;
		daChot: boolean;
		trangThai: ETrangThaiDuyetXuLyKqht;

		//ý kiến cố vấn học tập
		yKienCoVanHocTap: string;
		trangThaiYKienCVHT: EYKienCoVanHocTap;
		coVanHocTapSsoId: string;

		//Cảnh báo học tập
		thuTuHocKy: string;
	}
}
