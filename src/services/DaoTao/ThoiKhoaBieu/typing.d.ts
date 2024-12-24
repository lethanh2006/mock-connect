import { type ELoaiHinhHocTap } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { HocPhan } from '../HocPhan/typings';
import type { ETrangThaiLopDiemDanh, ETrangThaiUserDiemDanh } from '../constant';
import type { EHinhThucGiangDay } from '@/services/HocTap/constant';

declare module ThoiKhoaBieu {
	export interface IRecord {
		_id: string;
		tenLopHocPhan: string;
		lopHocPhan?: LopHocPhan.IRecord;
		nhanSuSsoId?: string; // 'string';
		nhanSu?: ToChucNhanSu.INhanSu;
		giangVien?: ToChucNhanSu.INhanSu; // Khi lấy thời khóa biểu
		maNhanSu?: string;
		tenNhanSu?: string;

		ngay: string; //'2023-05-20T08:34:26.620Z';
		nhomTietHocId: string; // 'string';
		// nhomTietHoc: NhomTietHoc.IRecordCoSo;
		tietBatDau: number;
		tietKetThuc: number;
		phongHoc?: string;
		loaiHinhHocTap: ELoaiHinhHocTap;

		noiDungHpId?: string;
		/** Nội dung trong đề cương học phần (phục vụ demo trường Đảng) */
		noiDungHp?: HocPhan.ILichTrinhChung;
		tieuDeBaiHoc?: string;
		noiDungBaiHoc?: string;
		urlBaiHoc?: string | null;
		hocLieuList?: { ten?: string; url?: string | null }[];
		thoiGianBatDau?: string; //'2023-05-20T08:34:26.620Z';
		thoiGianKetThuc?: string; // '2023-05-20T08:34:26.620Z';

		// Điểm danh
		trangThaiDiemDanh?: ETrangThaiLopDiemDanh;
		trangThaiDiemDanhCaNhan?: ETrangThaiUserDiemDanh;

		hinhThucGiangDay: EHinhThucGiangDay;
	}
}
