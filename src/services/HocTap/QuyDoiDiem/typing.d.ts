import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrangThaiDotQuyDoiDiem,
	ETrangThaiSinhVienQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
} from '../constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';

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

	export interface IQuyDoiDiemSinhVien {
		_id: string;
		create: boolean;
		danhSachMinhChungQuyDoi: IMinhChungQuyDoiDiem[];
		sinhVienSsoId: string;
		sinhVien: SinhVien.IRecord;
		maSinhVien: string;
		hoTen: string;
		maDon: string;
		maHocPhan: string;
		hocPhan: HocPhan.IRecord;
		diemHe10: number;
		diemHe4: number;
		diemChu: string;

		trangThai: ETrangThaiSinhVienQuyDoiDiem;

		ghiChu: string;
		nguoiChoYKienSsoId: string;
		hoTenNguoiChoYKien: string;
		thoiGianChoYKien: Date;

		soQuyetDinh: string;
		thoiGianBanHanh: Date;

		dotDangKyQuyDoiDiemId: string;
	}

	export interface IMinhChungQuyDoiDiem {
		_id: string;
		quyDoiDiemSvId: string;

		loai: EMinhChungQuyDoiDiem;
		tenChungChi: string;
		bacChungChi: string;
		donViCap: string;
		thoiGianHieuLuc: Date;
		thoiGianHetHieuLuc: Date;
		urlsChungChi: string[] | null;

		loaiHocPhan: ELoaiHocPhanMinhChung;
		tenHocPhan: string;
		maHocPhan: string;
		trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem;
		tenTruong: string;
		soTinChi: number;
		diemHe10: number;
		diemHe4: number;
		diemChu: string;
		urlsHocPhan: string[] | null;
	}
}
