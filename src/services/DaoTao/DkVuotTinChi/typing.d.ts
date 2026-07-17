import { type TrangThaiDonDangKyHocVuot } from './constant';

export namespace DkVuotTinChi {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		maHocKy: string;
		lopHocPhanId: string;
		trangThai: TrangThaiDonDangKyHocVuot;
		nguoiDuyet?: string | null;
		thoiGianDuyet?: string | null;
		ghiChuDuyet?: string | null;
		createdAt?: string;
		updatedAt?: string;
		sinhVien?: SinhVien.IRecord;
		lopHocPhan?: LopHocPhan.IRecord;
		hocKy?: HocKy.IRecord;
	}

	export interface ISoTinChiDangKy {
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
		ghiChu?: string | null;
	}
}
