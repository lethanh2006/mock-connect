import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiDotQuyDoiDiem,
	ETrangThaiHocPhanQuyDoi,
	ETrinhDoMinhChungQuyDoiDiem,
} from '../constant';

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
		trangThai: ETrangThaiSinhVienDot;
		soQuyetDinhId: string;
		quyetDinh: QuyetDinh.IRecord;
		thoiGianBanHanh: Date;
		dotDangKyQuyDoiDiemId: string;
		dotDangKyQuyDoiDiem?: QuyDoiDiem.DotQuyDoiDiem;
		danhSachHocPhan: IQuyDoiDiemSinhVien[];
		urlsMinhChung: string[] | null;

		soTinChiDaCongNhan: number;
		soTinChiChuongTrinhDaoTao: number;
		soTinChiCongNhanDot: number;

		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;
	}

	export interface IQuyDoiDiemSinhVien {
		_id: string;
		phieuDangKyQuyDoiDiemId: string;
		phieuDangKyQuyDoiDiem: string;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		diemHe10: number;
		diemHe4: number;
		diemChu: string;
		trangThai: ETrangThaiHocPhanQuyDoi;
		ghiChu: string;
		nguoiChoYKienSsoId: string;
		hoTenNguoiChoYKien: string;
		thoiGianChoYKien: Date;
		khuyenNghi: string[];

		//Minh chứng
		loai: EMinhChungQuyDoiDiem;
		tenChungChi: string;
		urlsChungChi: string;
		diemChungChi: string;
		bacChungChi: string;
		donViCap: string;
		thoiGianHieuLuc: Date;
		thoiGianHetHieuLuc: Date;
		tenHocPhan: string;
		trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem;
		tenTruong: string;
		maHocPhanMinhChung: string;
		soTinChi: number;
		diemHe10MinhChung: number;
		diemHe4MinhChung: number;
		diemChuMinhChung: string;
		urlsHocPhan: string;
		loaiHocPhan: ELoaiHocPhanMinhChung;
		namTotNghiep: number;
		nganh: number;
	}
}
