import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { EDoiTuongLopHanhChinh } from '../constant';

declare module LopHanhChinh {
	export interface IRecord {
		_id: string;
		ten: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		siSo: number;
		doiTuong?: EDoiTuongLopHanhChinh; // To remove

		nhanSuSsoId?: string; // Cũ => remove
		giangVien?: ToChucNhanSu.INhanSu; // Cũ => remove
		lopHcNsKyList?: INhanSuHocKy[];

		sinhVienList?: SinhVien.IRecord[]; // Cũ => remove
		sinhVienKyList?: SinhVien.IRecord[];
		lopHcSvKyList?: SinhVien.ISinhVienHocKy[];

		createdAt?: string;
		updatedAt?: string;

		/** populate khi sinh viên get lớp hành chính */
		lopHcSvKy?: SinhVien.ISinhVienHocKy;
	}

	export interface IRecordSinhVien {
		_id: string;
		lopHanhChinhId: string;
		lopHanhChinh: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
	}

	export interface INhanSuHocKy {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		nhanSuSsoId: string;
		hoTenNhanSu: string;
		maNhanSu: string;
		nhanSu?: ToChucNhanSu.INhanSu;

		tenLopHc: string;
		lopHc?: IRecord;
	}
}
