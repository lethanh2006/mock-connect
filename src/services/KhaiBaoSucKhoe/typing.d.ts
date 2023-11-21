import type { ETinhTrangSucKhoe } from './constant';

declare module KhaiBaoSucKhoe {
	export interface IRecord {
		_id: string;
		dotKhamSucKhoeId: string;
		dotKhamSucKhoe: IRecord;
		maSinhVien: string;
		sinhVienSsoId: string;
		hoTen: string;
		tinhTrangSucKhoe: ETinhTrangSucKhoe;
	}
}
