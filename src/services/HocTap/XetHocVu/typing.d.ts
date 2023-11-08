import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { ETrangThaiDuyetCanhBao, EYKienCoVanHocTap } from '../constant';

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

		danhSachLyDo: ILyDo[];
		daChot: boolean;
		trangThai: ETrangThaiDuyetCanhBao;

		//ý kiến cố vấn học tập
		yKienCoVanHocTap: string;
		trangThaiYKienCVHT: EYKienCoVanHocTap;
		coVanHocTapSsoId: string;

		//Cảnh báo học tập
		thuTuKy: string;

		//Cảnh báo thôi học
		loaiThoiHoc: ELoaiThoiHoc;
	}

	export interface ILyDo {
		_id: string;
		canhBaoKqhtId?: string;
		// canhBaoKetQuaHocTap?: ICanhBaoHocTap;
		thoiHocId?: string;
		// thoiHoc?: IThoiHoc;

		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		hoTen?: string;
		maSinhVien: string;
		maKhoaSinhVien: string;
		tenLopHanhChinh: string;

		noiDung?: string;
		isCoVanHocTap?: boolean;
		dongY?: boolean;
		yKien?: string;

		donViXuLy?: string;
	}
}
