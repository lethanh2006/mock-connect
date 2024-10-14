declare module QuyChe {
	export interface IRecord {
		_id: string;
		maModule: string;
		ten: string;
		moTa: string;
		fileDinhKem: string;
		createdAt: string;
		soQuyetDinh: string;
		ngayBanHanh: string;
		doiTuong: EDoiTuongKeHoachNCKH[];
	}
}
