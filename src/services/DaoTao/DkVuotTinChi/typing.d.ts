import type { SinhVien } from '../SinhVien/typings';
import { type TrangThaiDonDangKyHocVuot } from './constant';

export namespace DkVuotTinChi {
	export interface IRecord {
		_id: string;
		sinhVienSsoId: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		trangThai: TrangThaiDonDangKyHocVuot;
		soTinChiToiDaDangKy: number;
		stcToiDaDangKy?: number;
		nguoiDuyet?: string | null;
		thongTinNhanSuDuyet: string;
		nguoiXuLy?: string | null;
		thoiGianDuyet?: string | null;
		ghiChuNguoiDuyet?: string | null;
		ghiChu?: string | null;
		createdAt?: string;
		maSinhVien?: string;
		hoTen?: string;
		stcToiThieuHienTai?: number;
		stcToiDaHienTai?: number;
		soTinChiToiThieu?: number;
		soTinChiToiDa?: number;
		sinhVien?: SinhVien.IRecord;
	}

	export interface ISoTinChiDangKy {
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
		ghiChu?: string | null;
	}
}
