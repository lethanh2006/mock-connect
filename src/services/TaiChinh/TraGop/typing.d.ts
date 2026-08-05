import type { EHinhThucHoTro, ETrangThaiDuyetYeuCau, ETrangThaiPhienTraGop } from './constant';

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
		hinhThucHoTro: EHinhThucHoTro;
		soLanTraGopYeuCau?: number;
		ngayGiaHanYeuCau?: string;
		college?: string;
		tongTienHocBongHoTro?: number;
		lyDo?: string;
		deXuatLoTrinhThanhToan?: string;
		camKet?: boolean;
		taiLieuDinhKem?: string[];
	}

	export interface IYeuCau {
		_id: string;
		billId: string;
		identityCode: string;
		userSsoId: string;
		userCode: string;
		userFullname: string;
		hinhThucHoTro?: EHinhThucHoTro;
		soLanTraGopYeuCau?: number;
		ngayGiaHanYeuCau?: string;
		college?: string;
		tongTienHocBongHoTro?: number;
		lyDo: string;
		deXuatLoTrinhThanhToan?: string;
		camKet?: boolean;
		taiLieuDinhKem?: string[];
		trangThaiDuyet: ETrangThaiDuyetYeuCau;
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
