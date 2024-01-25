import type { EVaiTroHoiDong } from './constant';

declare module HoiDong {
	export interface ThanhVienHoiDong {
		ssoId: string;
		ten: string;
		ma: string;
		vaiTroHoiDong: EVaiTroHoiDong;
		donVi: string;
		maDonVi: string;
		hocHam: string;
		hocVi: string;
		soDienThoai: string;
		email: string;
		index: number;
	}

	export interface IRecord {
		_id: string;
		quyTrinhId: string;
		dotQuyTrinhId: string;
		maBuoc: string;
		ten: string;
		startDate: string;
		endDate: string;
		danhSachThanhVien: ThanhVienHoiDong[];
		danhSachVanBanLuuTru: { tenFile: string; url: string }[];
	}
}
