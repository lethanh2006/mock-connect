import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
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
		doiTuong?: EDoiTuongLopHanhChinh;

		nhanSuSsoId?: string;
		giangVien?: ToChucNhanSu.INhanSu;
		sinhVienList?: SinhVien.IRecord[];
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordSinhVien {
		_id: string;
		lopHanhChinhId: string;
		lopHanhChinh: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
	}
}
