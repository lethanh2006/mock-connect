import { HocKy } from '@/services/HocKy/HocKy/typing';
import { EChiSoSoSanh, EDoiTuongTheChat, EMucDanhGiaTheChat, EXepLoaiTheChat } from './constant';

declare module TheChat {
	export interface IDanhMucTheChat {
		_id: string;
		ma: string;
		ten: string;
		donViDoLuong: string;
		ghiChu: string;
		tieuChiTheChat: ITieuChiTheChat[];
		moTa: string;
		soSanh: EChiSoSoSanh;

		batBuoc: boolean;
		suDungThietBiNgoaiVi: boolean;

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
		donViDoLuong: string;
		xepLoai: EXepLoaiTheChat;
		lanDanhGia: number;
		thoiGianDanhGia: Date;

		metadata: IMetaData;

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
		nhipTimBatDau: number;
		nhipTimKetThuc: number;
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

	export interface IThongKeSinhVienTheChatDanhGia {
		soBaiDanhGia: number;
		soLuotDanhGiaChuaDat: number;
		soLuotDanhGiaDat: number;
		soLuotDanhGiaTot: number;
		soSinhVienChuaDanhGia: number;
		soSinhVienDaDanhGia: number;
		soSinhVienDanhGiaLai: number;
		soSinhVienDanhGiaTheHinh: number;
	}

	export interface IMetaData {
		STUDENT_CODE: string;
		EXAM_ID: number;
		DEVICE_ID: number;
		STUDENT_DISTANCE: number;
		STUDENT_MINS: number;
		STUDENT_SCORE: number;
		STUDENT_MAP: string;
		STUDENT_HEART_START: number;
		STUDENT_HEART_END: number;
	}
}
