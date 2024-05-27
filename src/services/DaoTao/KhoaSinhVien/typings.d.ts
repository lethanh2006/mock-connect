declare module KhoaSinhVien {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maHinhThucDaoTao: string;
		hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		namHocBatDau: number;
		createdAt?: string;
		updatedAt?: string;
	}
}
