import type { ETrangThaiPhienTraGop, ETrangThaiTraGopBill } from './constant';

declare module TraGop {
	export interface ICheckEligible {
		eligible: boolean;
		billId: string;
		identityCode: string;
		maxSoLanTraGop: number;
		tongTien?: number;
		reason?: string;
	}

	export interface IYeuCauPayload {
		billId: string;
		soLanTraGopYeuCau: number;
		lyDo: string;
		taiLieuDinhKem?: string[];
	}

	export interface IYeuCau {
		_id: string;
		billId: string;
		identityCode: string;
		userSsoId: string;
		userCode: string;
		userFullname: string;
		soLanTraGopYeuCau: number;
		lyDo: string;
		trangThaiDuyet: ETrangThaiTraGopBill;
		createdAt: string;
	}

	export interface IPhienTraGop {
		_id: string;
		yeuCauTraGopId: string;
		billId: string;
		lanTraGop: number;
		soTien: number;
		soTienDaNop: number;
		ngayHetHan: string;
		trangThai: ETrangThaiPhienTraGop;
	}
}
