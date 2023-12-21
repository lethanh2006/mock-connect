declare module DotThuTaiChinh {
	export interface Record {
		_id: string;
		tenDot: string; // 'string';
		thoiGianBatDau: string; // '2023-03-02T08:12:50.994Z';
		thoiGianKetThuc: string; //'2023-03-02T08:12:50.994Z';

		danhSachMaNguonThu: string[];
		danhSachMaKhoanThu: string[];
		danhSachMaMucThu: string[];
		// danhSachNguonThu?: NguonThu.Record[];
		// danhSachKhoanThu?: KhoanThu.Record[]; // {};
		// danhSachMucThu?: MucThu.Record[]; // [{}];

		kichHoat: boolean; // true;
		metadata?: Record;
	}
}
