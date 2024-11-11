import type { ELoaiSoSanh } from './constant';

declare module KyThi {
	export interface IRecord {
		maHocKy: string;
		ten: string;
		ma: string;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		startDongBoTuCach: string;
		endDongBoTuCach: string;
		startPhanCongCoiThi: string;
		danhSachHocPhanKhongDuocDangKy: { ten: string; ma: string; id: string }[];
		endPhanCongCoiThi: string;
		thoiGianDangKyBatDau: string;
		thoiGianDangKyKetThuc: string;
		thoiGianPhanCongHocPhanBatDau: string;
		thoiGianPhanCongHocPhanKetThuc: string;
		_id: string;
		danhSachTapTin: { ten: string; url: string }[];
		active: boolean;
		lapKeHoach: boolean;
		congTacChuanBi: boolean;
		giamThi: boolean;
		hocPhanThi: boolean;
		sinhVienThi: boolean;
		deThi: boolean;
		toChucThi: boolean;
		lichThi: boolean;
		chamThi: boolean;
		phucKhaoThamDinh: boolean;
		phucKhao: boolean;
		thamDinh: boolean;
		danhSachKhoaThi: KhoaThi[];
		maTrinhDo: string;
		maHinhThuc: string;
		choPhepDangKy: boolean;
		maHocKyHoanThanhHocPhi: string;
		tenHocKyHoanThanhHocPhi: string;
		cauHinhPhanCongLichThi: CauHinhPhanCongLichThi;
		chenhLech: number;
		loaiSoSanh: ELoaiSoSanh;
		maLopHanhChinhList: string[];
		chotSinhVienThi: boolean;
		cauHinhXepLich: CauHinhXepLich;
	}
}
