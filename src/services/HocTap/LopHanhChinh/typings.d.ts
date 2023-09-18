declare module LopHanhChinh {
	export interface IRecord {
		_id: string;
		ten: string;
		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;
		siSo: number;
		nhanSuSsoId?: string;
		giangVien?: ToChucNhanSu.INhanSu;
		sinhVienList?: SinhVien.IRecord[];
		createdAt?: string;
		updatedAt?: string;
	}
}
