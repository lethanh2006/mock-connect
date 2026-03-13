import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { EDKDTCongNo, EDKDTKetQuaHocTap, ETrangThaiThi } from '../constant';

declare module LichThi {
	export interface IRecord {
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		phong?: TObject;
		danhSachHocPhan?: TObject[];
		dieuKienKetQuaHocTap: EDKDTKetQuaHocTap;
		dieuKienCongNo: EDKDTCongNo;
		trangThai: ETrangThaiThi;
	}

	export interface IRecordMe {
		lichThiId: string;
		kyThi: string;
		tenHocPhan: string;
		maHocPhan: string;
		soLuong: number;
		ngayThi: string;
		gioThi: string;
		phong: string;
		dieuKienKetQuaHocTap: EDKDTKetQuaHocTap;
		dieuKienCongNo: EDKDTCongNo;
		trangThai: ETrangThaiThi;
	}

	export interface SinhVienLichThi {
		lop: string;
		ma: string;
		sbd: string;
		ten: string;
	}

	export type TObject = Pick<HocPhan.IRecord, 'ma' | 'ten'>;
}
