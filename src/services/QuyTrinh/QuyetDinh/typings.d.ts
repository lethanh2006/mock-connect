declare module QuyetDinhGiaoDeTai {
	export interface IRecord {
		_id: string;
		dotQuyTrinhDongId: string;
		maBuoc: string;
		danhSachVanBanLuuTru: {
			tenFile: string;
			url: string;
		}[];
	}
}
