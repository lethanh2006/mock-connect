declare module KhoanThu {
	export interface Record {
		_id: string;
		ma: string;
		name: string;
		thuocTinhLoc: EMaDoiTuongApDung[];
		maNguonThu: string;
		nguonThuChiTiet?: NguonThu.Record;
		dinhKy?: EDinhKy | null;
		thuTheoDot: boolean;

		// loaiTinhThue: EMaLoaiTinhThueKhoanThu;
		// mucThue?: number;
		// unitLabel?: string;
		// xuatHoaDon: ELoaiXuatHoaDon;
		// active: boolean;
		// metaData: any;
	}
}
