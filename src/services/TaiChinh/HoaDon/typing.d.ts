import type { UuDaiThanhToan } from '../UuDaiThanhToan/typing';
import type { EMaTrangThaiThanhToan } from '../constant';

declare module HoaDon {
	export interface IRecord extends IKhachHang {
		_id: string;
		identityCode: string;
		ma?: string;

		callBackUrl?: string;
		status: EMaTrangThaiThanhToan;
		soTienThue: number;
		idDotThu: string;
		dotThu?: DotThuTaiChinh.Record;
		metadata?: Record;
		moTa?: string;

		ngayHetHanThanhToan: string;
		urlBienLai?: string;
		maBienLai?: string;
		billItems?: IBillItem[];
	}

	interface IKhachHang {
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
		// maNguonThu: string;
		ten: string;

		//Khoản thu
		maKhoanThu: string;
		tenKhoanThu: string;

		//Mức thu
		maMucThu: string;
		unitAmount: number;
		unitLabel: string;
		quantity: number;
		heSo: number;

		amountDue: number;
		amountDiscount: number;
		amountPaid: number;
		amountRemaining: number;

		listUserUuDai?: Partial<UuDaiThanhToan.IUuDaiUser>[];
		status: EMaTrangThaiThanhToan;
	}
}
