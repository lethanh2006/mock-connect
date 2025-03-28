import type { ETrangThaiDuyetMuonSach, ETrangThaiMuonSach, EVaiTroMuonTra } from '../constant';
import type { MuonSach } from '../MuonSach/typing';

declare module PhieuMuonTra {
	export interface IRecord {
		_id: string;
		ghiChu: string;
		maHocKy: string;
		ghiChuDangKy: string;
		vaiTro: EVaiTroMuonTra;
		ssoIdNguoiMuon: string;
		maDinhDanhNguoiMuon: string;
		hoTenNguoiMuon: string;
		ssoIdNguoiDuyetChoMuon: string;
		maDinhDanhNguoiDuyetChoMuon: string;
		hotenNguoiDuyetChoMuon: string;
		thoiGianDangKy: Date;
		trangThaiDuyet: ETrangThaiDuyetMuonSach;

		danhSachAnPhamMuonTra?: MuonSach.IRecord;

		maNganhNguoiMuon: string;
		tenNganhNguoiMuon: string;
		maKhoaSinhVienNguoiMuon: string;
		tenKhoaSinhVienNguoiMuon: string;
		maLopHanhChinhNguoiMuon: string;
		tenLopHanhChinhNguoiMuon: string;
		maKhoaNguoiMuon: string;
		tenKhoaNguoiMuon: string;
		trangThaiHoc: ETrangThaiHocSv;

		createdAt: Date;
		updatedAt: Date;
	}
}
