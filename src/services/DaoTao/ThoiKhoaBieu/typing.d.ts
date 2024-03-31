import { type ELoaiHinhHocTap } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { ETrangThaiLopDiemDanh, ETrangThaiUserDiemDanh } from '../constant';

declare module ThoiKhoaBieu {
	export interface IRecord {
		_id: string;
		tenLopHocPhan: string;
		lopHocPhan?: LopHocPhan.IRecord;
		nhanSuSsoId?: string; // 'string';
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		ngay: string; //'2023-05-20T08:34:26.620Z';
		nhomTietHocId: string; // 'string';
		// nhomTietHoc: NhomTietHoc.IRecordCoSo;
		tietBatDau: number;
		tietKetThuc: number;
		phongHoc?: string;
		loaiHinhHocTap: ELoaiHinhHocTap;
		tieuDeBaiHoc?: string;
		noiDungBaiHoc?: string;
		urlBaiHoc?: string | null;
		thoiGianBatDau?: string; //'2023-05-20T08:34:26.620Z';
		thoiGianKetThuc?: string; // '2023-05-20T08:34:26.620Z';

		// Điểm danh
		trangThaiDiemDanh?: ETrangThaiLopDiemDanh;
		trangThaiDiemDanhCaNhan?: ETrangThaiUserDiemDanh;
	}
}
