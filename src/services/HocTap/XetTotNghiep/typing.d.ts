import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { EKetQuaXetTotNghiep, ELoaiDoiTuongXetTotNghiep, ETrangThaiDuyetXetTotNghiep } from './constant';
declare module DotXetTotNghiep {
	export interface IRecord {
		_id: string;
		ten: string;
		ngayLapKeHoach?: string;
		ngayLapHoiDong?: string;
		ngayChotDanhSach?: string;
		ngayHop?: string;

		daKhoiTao?: boolean;
		daCongBo?: boolean;
		daChotDanhSach?: boolean;
		daKetThuc?: boolean;
	}

	export interface ISinhVienDot {
		_id: string;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maSinhVien?: string;
		tenSinhVien?: string;

		dotXetTotNghiepId: string;
		dotXetTotNghiep?: IRecord;
		loaiDoiTuong?: ELoaiDoiTuongXetTotNghiep;
		ketQua: EKetQuaXetTotNghiep;
		trangThaiDuyet: ETrangThaiDuyetXetTotNghiep;
		lyDo?: string;
		yKienSinhVien?: string;
	}

	export interface IDotHienHanh extends IRecord {
		ketQuaXetTotNghiep?: ISinhVienDot;
	}
}
