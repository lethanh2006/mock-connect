import type { ETrangThaiDuyetBienBanHopDiemRenLuyen } from './constant';

declare module BienBanHopDiemRenLuyen {
	export interface NguoiThamGia {
		ten: string;
		ma: string;
		ssoId: string;
	}

	export interface IRecord {
		chuTri: NguoiThamGia;
		thuKy: NguoiThamGia;
		trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen;
		_id: string;
		dotChamDiemId: string;
		dotChamDiem: DotChamDiemRenLuyen.IRecord;
		tenLopHC: string;
		maHocKy: string;
		thoiGian: string;
		diaDiem: string;
		soCoMat: number;
		soVangMat: number;
		sinhVienVang: string;
		yKien: string;
		kienNghiDeXuat: string;
		daGui: boolean;
		ketThuc: boolean;
		noiDungYeuCauChinhSua: string;
	}
}
