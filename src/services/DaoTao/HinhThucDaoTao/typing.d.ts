declare module HinhThucDaoTao {
	export interface IRecordNhaNuoc {
		_id: string;
		ten: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordBo {
		_id: string;
		ma: string;
		ten: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordCoSo {
		_id: string;
		maDmHinhThuc: string;
		dmHinhThuc?: HinhThucDaoTao.IRecordBo;
		ma: string;
		ten: string;
		canCuId: string | null;
		canCu?: VanBanQuyDinh.IRecord;
		createdAt?: string;
		updatedAt?: string;
	}
}
