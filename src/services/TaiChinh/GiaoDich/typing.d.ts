import type { ETransactionPaymentType, ETransactionSourceType, ETransactionStatus } from '../constant';

declare module GiaoDich {
	export interface IRecord extends IKhachHang, IChuyenVien {
		_id: string;
		billIdentityCode: string;
		name: string;
		idDotThu: string;
		dotThu?: DotThuTaiChinh.Record;
		paymentType: ETransactionPaymentType;
		status: ETransactionStatus;
		identityCode: string;

		fromAccount: ETransactionSourceType;
		toAccount: ETransactionSourceType;
		amount: number;

		transactionId: string;
		transactionDate: string;
		requestId: string;
		requestData: Record;
		responseData: Record;

		createdAt?: Date;
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

	interface IChuyenVien {
		manualUserSsoId: string;
		manualUserFullname: string;
		manualUserCode: string;
		manualUserAddress: string;
		manualUserEmail: string;
		manualUserDOB: string;
		manualUserPhone: string;
		manualUserMetadata: Record;
	}

	export type TDongTruocHocPhi = {
		amount: number;
		paymentType: ETransactionPaymentType;
	};

	export type TThanhToan = {
		billIdentityCode: string;
		topupAmount: number;
		paymentType: ETransactionPaymentType;
		fullBill: boolean;
	};

	export type TThanhToanResponse = {
		giaoDichThanhToan: IRecord;
		giaoDichTopup: IRecord;
	};

	export type TMomoConfig = {
		userFeeMax: number;
		userFeePercent: number;
	};

	export type TMomoResponse = TMomoConfig & {
		payUrl: string;
		deeplink: string;
		qrCodeUrl: string;
		deeplinkMiniApp: string;
		userFee: number;
	};

	export type TUserWallet = {
		totalIn: number;
		totalOut: number;
		totalRemain: number;
	};
}
