import { type TrangThaiDonDangKyHocDuThinh } from './constant';

export namespace DangKyHocDuThinh {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		maHocKy: string;
		lopHocPhanId: string;
		trangThai: TrangThaiDonDangKyHocDuThinh;
		nguoiDuyet?: string | null;
		thoiGianDuyet?: string | null;
		ghiChuDuyet?: string | null;
		dataPartitionCode?: string | null;
		createdAt?: string;
		updatedAt?: string;
		sinhVien?: SinhVien.IRecord;
		lopHocPhan?: LopHocPhan.IRecord;
		hocKy?: HocKy.IRecord;
		lyDo?: string | null;
	}
}
