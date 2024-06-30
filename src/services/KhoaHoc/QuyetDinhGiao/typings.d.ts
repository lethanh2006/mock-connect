import type { DeTaiKHCN } from '../DeTaiKHCN/typings';
import type { ELoaiDeTai } from '../KeHoachDeTai/constants';
import type { KeHoachDeTai } from '../KeHoachDeTai/typings';

declare module QuyetDinhGiao {
	export interface IRecord {
		_id: string;
		dotDangKyId: string;
		so: string;
		deTaiIds: string[];
		idDonVi: string;
		maDonVi: string;
		tenDonVi: string;
		urlQuyetDinhGiao: string;
		daGiao: boolean;
		dotDangKy: KeHoachDeTai.IRecord;
		danhSachDeTai: DeTaiKHCN.IRecord[];
		ten: string;
		loaiDeTaiQuyetDinhGiao: ELoaiDeTai;
	}
}
