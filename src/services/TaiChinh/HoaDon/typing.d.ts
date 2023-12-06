import type { EMaTrangThaiThanhToan } from '../constant';

declare module HoaDon {
	export interface IRecord extends IKhacHang {
		_id: string;
		identityCode: string;
		ma?: string;

		callBackUrl?: string;
		status: EMaTrangThaiThanhToan;
		soTienThue: number;
		idDotThu: string;
		// dotThu?: DotThu.Record;
		metadata?: Record;
		moTa?: string;

		ngayHetHanThanhToan: string;
		urlBienLai?: string;
		maBienLai?: string;
		billItems?: IBillItem[];
	}

	interface IKhacHang {
		userSsoId: string;
		userFullname: string;
		userCode: string;
		userAddress: string;
		userEmail: string;
		userDOB: string;
		userPhone: string;
		userMetadata?: Record;
	}

	export interface IBillItem {
		_id: string;
		billIdentityCode?: string;
		maNguonThu: string;

		//Khoản thu
		maKhoanThu: string;
		tenKhoanThu: string;

		//Mức thu
		maMucThu: string;
		unitAmount: number;
		unitLabel: string;
		quantity: number;
		amountDue: number;
		amountPaid: number;
		amountRemaining: number;
		amountRefund: number;
		heSo: number;
		status: EMaTrangThaiThanhToan;
	}
}
