declare module NganhDaoTao {
	export interface IRecordBo {
		_id: string;
		ma: string;
		ten: string;
		dmNhomNganhId: string;
		dmTrinhDoId: string;
		dmNhomNganh?: NhomNganhDaoTao.IRecordBo;
		dmTrinhDo?: TrinhDoDaoTao.IRecordBo;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IRecordCoSo {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh: string;
		dmNganhId?: string;
		dmNganh?: NganhDaoTao.IRecordBo;
		maTrinhDo: string;
		trinhDo?: TrinhDoDaoTao.IRecordCoSo;
		canCuId?: string;
		canCu?: VanBanQuyDinh.IRecord;
		maNganhGoc?: string | null;
		nganhGoc?: IRecordCoSo;
		createdAt?: string;
		updatedAt?: string;
	}
}
