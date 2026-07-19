import type { TaiSan } from '../TaiSan/typing';
import type { ELoaiDeAn, ETinhTrangCoSoVatChat } from '../constant';

declare module Phong {
	export interface ITienIch {
		maDanhMucTienIch?: string;
		ten: string;
	}

	export interface IRecord {
		_id: string;
		maToaNha: string;
		toaNha?: ToaNha.IRecord;
		maKhuNha: string;
		khuNha?: KhuNha.IRecord;
		tangThu: number;
		soPhong: string;
		ma: string;
		ten: string;

		maLoaiPhongKtx?: string;
		maLoaiPhong: string;
		loaiPhong?: LoaiPhong.IRecord;

		idDonViSuDung: string;
		maDonViSuDung: string;
		tenDonViSuDung: string;

		sucChua: number;
		sucChuaHoc: number;
		sucChuaThi: number;

		// Field dùng cho RoomCard
		soLuongToiDa: number;
		soLuongHienTai: number;
		coTheDangKy?: boolean;
		danhSachAnh?: string[];
		danhSachTienIch?: ITienIch[];
		maKhoanThuPhong?: string;
		soPhongTam?: number;

		thietBiCNC: boolean;
		danhSachTinhChatPhong: ITinhChatPhong[];
		danhSachTaiSan: TaiSan.IRecord[];
		tenVietTatTinhChatPhongCongNangChinh: string;

		dienTich: number;
		maHinhThucSoHuu: string;
		hinhThucSoHuu?: HinhThucSoHuu.IRecord;
		tinhTrangCsvc: ETinhTrangCoSoVatChat;
		loaiDeAn: ELoaiDeAn;

		namDuaVaoSuDung: number;
		maLoaiCongTrinh: string;
		loaiCongTrinh?: LoaiCongTrinh.IRecord;
		maMucDichSuDung: string;
		mucDichSuDung?: MucDichSuDung.IRecord;

		doiTuongSuDung: string;
		vonBanDau: number;
		vonDauTu: number;
		trongTrinhTrongNha: boolean;
		soPhongCongVu: number;
		soPhongOCanBo: number;

		loaiPhongKtx?: any;
		isChoThue?: boolean;
		cachBoTri: string | null;
		moTa?: string | null;
		giaPhong?: number | null;
		donViTienTe?: string;
	}

	export interface IChinhSachPhongRecord {
		_id: string;
		maDotId: string;
		roomId: string;
		maNamHoc: string;

		quota?: number;
		isActive?: boolean;

		sucChua?: number | null;
		quocTich?: string | null;
		gender?: EGioiTinh | string | null;
		maLoaiPhongKtx?: string | null;
		loaiPhongKtx?: any;
		danhSachTienIch?: ITienIch[];
		danhSachAnh?: string[];
		moTa?: string | null;
		isChoPhepDangKy?: boolean;
		isPhatHanh?: boolean;
		nguoiBanHanh?: string;
		ngayBanHanh?: string;

		room?: IRecord;

		createdAt?: string;
		updatedAt?: string;
	}
}
