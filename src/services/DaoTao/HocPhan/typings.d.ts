import { type ELoaiToChucDayHoc } from '../constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maDonVi: string;
		donVi?: ToChucNhanSu.IDonVi;

		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: IDeCuongHocPhan;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILoaiHocPhan {
		_id: string;
		ma: string;
		ten: string;

		isTinhDiem: boolean;
		isTinhSoTinChiDangKy: boolean;
		isTinhSoTinChiTichLuy: boolean;
		khoiTuChon?: boolean;
		khoiTotNghiep?: boolean;
	}

	export interface IDeCuongHocPhan {
		_id: string;
		ma: string;
		maHocPhan: string;
		hocPhan: IRecord;
		nguoiBienSoan: string;
		ngayApDung: string;
		canCuId: string;
		canCu: VanBanQuyDinh.IRecord;

		mucTieuHocPhan: string;
		noiDungTomTat: string;
		noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;

		trongSo1?: number;
		trongSo2?: number;
		trongSo3?: number;
		trongSo4?: number;
		trongSo5?: number;
		trongSo6?: number;
		trongSo7?: number;
		trongSo8?: number;
		trongSo9?: number;
		trongSo10?: number;
	}

	export interface IGiangVienDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		nhanSuSsoId: string | null;
		hoTen?: string | null;
		chucDanh?: string | null;
		hocHam?: string | null;
		hocVi?: string | null;
		soDienThoai?: string | null;
		diaChi?: string | null;
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuan: number;
		noiDung: string;
		noiDungChinh: string;
		yeuCauSinhVien: string;
		ghiChu: string;
		ndTienTrinhList?: INoiDungTienTrinh[];
	}

	export interface INoiDungTienTrinh {
		_id: string;
		tienTrinhHpId: string;
		tienTrinhHp?: ITienTrinhHocPhan;
		loaiToChucDayHoc: ELoaiToChucDayHoc;
		soTiet: number;
	}

	export interface IHocLieuDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;

		idTaiLieuThuVien?: number; // Tài liệu tinh vân
		loaiTaiLieuThuVien?: 'item' | 'edata';
		maTaiLieuThuVien?: string;

		tieuDe?: string;
		moTa?: string;
		tacGia?: string;
		tenNhaXuatBan?: string;
		namXuatBan?: number;
		batBuoc: boolean;
		url?: string;
	}
}
