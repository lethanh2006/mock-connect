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
		tenVietTat: string;
		maTrinhDo: string;
		trinhDo?: TrinhDoDaoTao.IRecordCoSo;
		maDmNganh: string;
		dmNganh?: NganhDaoTao.IRecordBo;
		maCanCuPhapLy?: string;
		canCu?: VanBanQuyDinh.IRecord;
		maNganhGoc?: string | null;
		nganhGoc?: IRecordCoSo;

		maDonVi?: string;
		donVi?: ToChucNhanSu.IDonVi;

		createdAt?: string;
		updatedAt?: string;
	}
}
