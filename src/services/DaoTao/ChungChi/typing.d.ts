import type { EPhuongThucTinhDiem } from '../constant';

declare module ChungChi {
	export interface ILoaiChungChi {
		_id: string;
		ma: string;
		ten: string;
		isNgoaiNgu: boolean;
	}

	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maLoaiChungChi: string;
		loaiChungChi?: ILoaiChungChi;
		maNgonNgu?: string;
		ngonNgu?: NgoaiNgu.IRecord;
		phuongThucTinhDiem: EPhuongThucTinhDiem;
		bac?: TBac[];
		min?: number;
		max?: number;
		step?: number;
		chungChiCoThoiHan: boolean;
		thoiHanChungChi?: number;

		maDonVi?: string;
		choPhepDangKy?: boolean;
	}

	export type TBac = {
		order: number;
		ten: string;
	};
}
