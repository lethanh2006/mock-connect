import type { ELoaiPhanHoi } from './constant';

declare module PhanHoi {
	export interface IRecord {
		_id: string;
		createdAt?: string;
		updatedAt?: string;
		idDonDVMC?: string;
		loaiPhanHoi: ELoaiPhanHoi;
		noiDungPhanHoi: string;
		urlPhanAnh?: string | null;

		tieuDe?: string;
		maDonVi?: string;
		donVi?: ToChucNhanSu.IDonVi;
		noiDungTraLoiPhanHoi: string;
		daTraLoiPhanHoi: boolean;
		maChuyenVien: string;
		tenDonVi: string;
		thoiGianTraLoi: string;

		//Sinh Viên
		maSv: string;
		hoTen: string;
		ssoId: string;
		tenLinhVuc: string;
		lichSuDieuPhoi: ILichSuDieuPhoi;
	}

	export interface IChuDePhanHoi {
		_id: string;
		maDonVi: string;
		tenDonVi: string;
		tenLinhVuc: string;
		createdAt: Date;
		updatedAt: Date;
	}
}
