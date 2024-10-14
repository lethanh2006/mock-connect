import { type BieuMau } from '../BieuMau/typing';
import { type EPhamViChuDe } from '@/services/TinTuc/constant';
import type { ELoaiDot } from '../constants';

declare module DotKhaoSat {
	export interface IRecord {
		_id: string;
		ten: string;
		moTa: string;
		// danhSachVaiTro: EVaiTroBieuMau;
		// chucNangSuDung: EChucNangSuDung[];
		loai: ELoaiDot;
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		kichHoat: boolean;
		idKhaoSat: string;
		khaoSat?: BieuMau.Record;
		maHocKy: string;

		danhSachLopTinChi: BieuMau.GeneralInfo[];
		danhSachLopHanhChinh: BieuMau.GeneralInfo[];
		danhSachNguoiDung: BieuMau.GeneralInfo[];
		danhSachKhoaHoc: BieuMau.GeneralInfo[];
		danhSachNganhHoc: BieuMau.GeneralInfo[];
		danhSachDonVi: BieuMau.GeneralInfo[];
		loaiDoiTuongSuDung: ELoaiDoiTuong[];
		phamVi: EPhamViChuDe;
		hinhThucDaoTaoId: string;

		thongTinCauTraLoi?: BieuMau.IDanhGiaGiangVien[];

		// Populate
		daLam: boolean;
		updatedAt: Date;
		createdAt: Date;
	}
}
