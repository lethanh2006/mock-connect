import type { ETrangThaiDuyetMuonSach, ETrangThaiMuonSach } from '../constant';

declare module MuonSach {
	export interface IRecord {
		_id: string;
		soDangKyCaBiet: string;
		thongTinAnPham: AnPham.IAnPhamXepGia;
		thoiGianMuon: Date;
		expired: Date;
		thoiGianTra: Date;
		anPhamId: string;
		anPham: AnPham.IRecord;
		ghiChuTra: string;
		daLaySach: boolean;
		giaHan: boolean;
		thoiGianGiaHan: Date;
		thoiGianMuonDuKien: Date;
		thoiGianTraDuKien: Date;
		phieuMuonTraId: string;
		phieuMuonTra: PhieuMuonTra.IRecord;
		trangThai: ETrangThaiMuonSach;
		createdAt: Date;
		updatedAt: Date;

		ghiChuDangKy: string;
		ghiChu: string;
	}

	export type TSetting = {
		_id?: string;
		thoiHanMuonTraSach: number;
		idDonViThuVien: string;
		soLuongMuonToiDa: number;
	};

	export interface IThongKe {
		_id: string;
		choXuLy: number;
		daTra: number;
		dangThueMuon: number;
		quaHan: number;
	}
}
