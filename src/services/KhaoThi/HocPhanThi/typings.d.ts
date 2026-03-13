import type { ETrangThaiPhanCong } from './constant';

declare module HocPhanThi {
	export interface IRecord {
		_id: string;
		kyThiId: string;
		kyThi: KyThi.IRecord;
		ten: string;
		soTinChi: string;
		soBaiMotTui: number;
		soPhutThi: number;
		maDonVi: string;
		tenDonVi: string;
		tenPhuongThucThi: string;
		tenHinhThucThi: string;
		ma: string;
		maQldt: string;
		phanCongHocPhan: PhanCongHocPhan;
		trangThaiPhanCong: ETrangThaiPhanCong;
		dungDonViKhac: boolean;
		danhSachDonViPhu: { ma: string; ten: string }[];
		danhSachDiemThanhPhan: DiemThanhPhan[];
		duocSinhPhach: boolean;
		daSinhPhach: boolean;
		soSvMotNhomThi: number;
		soSvNhomLe: number;
		loaiPhong: ELoaiPhongHoc;
	}
}
