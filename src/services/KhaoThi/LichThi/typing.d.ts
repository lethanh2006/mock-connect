import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';

declare module LichThi {
	export interface IRecord {
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
		phong?: TObject;
		danhSachHocPhan?: TObject[];
	}

	export type TObject = Pick<HocPhan.IRecord, 'ma' | 'ten'>;
}
