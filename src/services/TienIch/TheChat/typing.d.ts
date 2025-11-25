import { HocKy } from '@/services/HocKy/HocKy/typing';
import { EDoiTuongTheChat, EDonViDoLuongTheChat, EMucDanhGiaTheChat, EXepLoaiTheChat } from './constant';

declare module TheChat {
	export interface IDanhMucTheChat {
		_id: string;
		ma: string;
		ten: string;
		donViDoLuong: EDonViDoLuongTheChat;
		ghiChu: string;
		tieuChiTheChat: ITieuChiTheChat[];
		ghiChu: string;
		soSanh: 'Lớn' | 'Nhỏ';

		createdAt: Date;
		updateAt: Date;
	}

	export interface ITieuChiTheChat {
		doTuoi: number;
		doiTuong: EDoiTuongTheChat;
		mucDanhGia: EMucDanhGiaTheChat;
		giaTri: number;
	}

	export interface IDotDanhGiaTheChat {
		_id: string;
		ma: string;
		tenDot: string;
		danhSachKhoaNganh: {
			maKhoaNganh: string;
			tenKhoaNganh: string;
		}[];
		namHoc: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		noiDungDanhGia: string;
		danhMucTheChat: { maDanhMuc: string; danhMuc: IDanhMucTheChat }[];
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		moTa: string;
		nguoiTaosoId: string;
		tenNguoiTao: string;

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IDanhSachKhoaNganh {
		index: number;

		maKhoaNganh: string;
		tenKhoaNganh: string;
	}

	export interface IKetQuaTheChat {
		_id: string;
		tenSv: string;
		maSv: string;
		lopHanhChinh: string;
		tenKhoaNganh: string;
		khoa: string;
		tenNganh: string;
		maNganh: string;
		maKhoaNganh: string;
		ssoIdSinhVien: string;
		dotDanhGiaTheChatId: string;
		ssoIdNguoiDanhGia: string;
		tenNguoiDanhGia: string;
		maDanhMuc: string;
		danhMuc: IDanhMucTheChat;
		noiDung: string;
		giaTri: number;
		donViDoLuong: EDonViDoLuongTheChat;
		xepLoai: EXepLoaiTheChat;
		lanDanhGia: number;

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IChiSoHinhThe {
		_id: string;
		maSv: string;
		tenSv: string;
		ssoIdSinhVien: string;
		lopHanhChinh: string;
		tenKhoaNganh: string;
		khoa: string;
		tenNganh: string;
		maNganh: string;
		maKhoaNganh: string;
		maHocKy: string;
		dotDanhGiaTheChatId: string;
		canNang: number;
		chieuCao: number;
		vongEo: number;
		vongMong: number;
		tenNguoiTao: string;
		ssoIdNguoiTao: string;

		bmi: number;
		whr: number;
		danhGiaChung: string;

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IThongKeSinhVienTheChat {
		ssoIdSinhVien: string;
		maSv: string;
		tenNganh: string;
		dotDanhGiaTheChatId: string;

		soLuongDanhMuc: number;
		soLuongDaDanhGia: number;
		soLuongDat: number;
		soLuongTot: number;
		soLuongChuaDat: number;
		soLuongChuaDanhGia: number;
		soLanDanhGia: number;

		chiTiet: {
			maDanhMuc: string;
			tenDanhMuc: string;
			giaTri: number;
			xepLoai: string;
		}[];
	}
}
