declare module MucThuHocPhi {
	export interface IRecord {
		_id: string;
		// ten: string;
		maKhoaNganh: string;
		// khoaNganh?: KhoaNganh.IRecord;
		maNamHoc: string;
		namHoc?: NamHoc.IRecord;

		maKhoaSinhVien: string;
		khoaSinhVien?: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh?: NganhDaoTao.IRecordCoSo;

		maMucThuCoBan: string;
		// mucThuCoBan?: MucThuTaiChinh.IRecord;
		// Giống bên tài chính
		currency: ECurrency;
		unitAmount: number;

		// heSoNhuCau: number;
		heSoTienTrinh: number;
		heSoHocLai: number;
		// heSoHocVuot: number;
		heSoHocCaiThien: number;
		// heSoChuaTheoTienTrinh: number;
		// heSoNgoaiChuongTrinh: number;
	}

	export type TMyMucThu = {
		mucThuKhoaNganhChinh: IRecord;
		mucThuKhoaNganhPhu?: IRecord;
	};
}
