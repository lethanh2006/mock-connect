import type { ETransactionPaymentType, ETransactionSourceType, ETransactionStatus } from '../constant';

declare module GiaoDich {
	export interface IRecord extends IKhachHang, IChuyenVien {
		_id: string;
		billIdentityCode: string;
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
		payerSsoId: string;
		payerFullname: string;
		payerCode: string;
		payerAddress: string;
		payerEmail: string;
		payerDOB: string;
		payerPhone: string;
		payerMetadata: Record;
	}

	export type TDongTruocHocPhi = {
		amount: number;
	};

	export type TThanhToan = {
		billIdentityCode: string;
		topupAmount: number;
		paymentType: ETransactionPaymentType;
		fullBill: boolean;
	};
}
