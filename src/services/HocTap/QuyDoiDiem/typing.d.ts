import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiDotQuyDoiDiem,
	ETrangThaiHocPhanQuyDoi,
	ETrangThaiPhieuQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
} from '../constant';
import type { ELoaiDiemChu } from '../LopHocPhan/constant';

declare module QuyDoiDiem {
	export interface DotQuyDoiDiem {
		_id: string;
		tenDot: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		thoiGianBatDauLayYKien: string;
		thoiGianKetThucLayYKien: string;

		trangThai: ETrangThaiDotQuyDoiDiem;
		ghiChu: string;
	}

	export interface IPhieuDangKyQuyDoiDiem {
		_id: string;
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maDon: string;
		trangThai: ETrangThaiPhieuQuyDoiDiem;
		soQuyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		// thoiGianBanHanh: Date;
		dotDangKyQuyDoiDiemId: string;
		dotDangKyQuyDoiDiem?: DotQuyDoiDiem;
		danhSachHocPhan: IQuyDoiDiemSinhVien[];
		urlsMinhChung: string[] | null;
		// ghiChu: string;

		soTinChiDaCongNhan: number;
		soTinChiChuongTrinhDaoTao: number;
		soTinChiCongNhanDot: number;

		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;
	}

	export interface IQuyDoiDiemSinhVien {
		_id: string;
		phieuDangKyQuyDoiDiemId: string;
		phieuDangKyQuyDoiDiem: IPhieuDangKyQuyDoiDiem;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		ghiChu?: string;

		// Kết quả quy đổi
		diemHe10: number;
		diemHe4: number;
		diemChu: ELoaiDiemChu;
		trangThai: ETrangThaiHocPhanQuyDoi;
		khuyenNghi: string[];

		// Người cho ý kiến?
		nguoiChoYKienSsoId: string;
		hoTenNguoiChoYKien: string;
		thoiGianChoYKien: Date;

		// Minh chứng chứng chỉ
		loai: EMinhChungQuyDoiDiem;
		tenChungChi: string;
		// urlsChungChi: string;
		// diemChungChi: string;
		bacChungChi: string;
		donViCap: string;
		thoiGianHieuLuc: Date;
		// thoiGianHetHieuLuc: Date;

		// Minh chứng học phần
		tenHocPhan: string;
		trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem;
		tenTruong: string;
		maHocPhanMinhChung: string;
		soDVHT: number;
		soTinChi: number;
		diemHe10MinhChung: number;
		diemHe4MinhChung: number;
		diemChuMinhChung: ELoaiDiemChu;
		// urlsHocPhan: string;
		loaiHocPhan: ELoaiHocPhanMinhChung;
		namTotNghiep: number;
		nganh: string;

		// Minh chứng nghiên cứu khoa học
		tenDeTaiNckh?: string;
		nguoiHuongDanNckh?: string;
		diemNckh?: number;

		// Minh chứng khác
		tinhDiemTichLuy: boolean;
	}
}
