import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { ETrangThaiDangKyChuyenNganh } from './constant';

declare module DangKyChuyenNganh {
	export interface IDotDangKy {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		ten: string;
		kichHoat: boolean;
		choPhepDangKyLai?: boolean;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
	}

	export interface ISinhVienDangKy {
		_id: string;
		dotDangKyChuyenNganhId: string;
		dotDangKyChuyenNganh?: IDotDangKy;
		sinhVienSsoId: string;
		maSinhVien: string;
		hoTen: string;
		sinhVien?: SinhVien.IRecord;

		maChuyenNganh: string;
		chuyenNganh?: NganhDaoTao.IRecordCoSo;
		trangThaiDangKy: ETrangThaiDangKyChuyenNganh;
		ghiChu?: string;

		createdAt?: string;
		updatedAt?: string;
	}

	export type TDangKy = Pick<ISinhVienDangKy, 'dotDangKyChuyenNganh' | 'maChuyenNganh'>;
}
