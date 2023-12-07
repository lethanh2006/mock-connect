import type { ETransactionPaymentType, ETransactionSourceType, ETransactionStatus } from '../constant';

declare module GiaoDich {
	export interface IRecord extends IKhacHang, IChuyenVien {
		_id: string;
		paymentType: ETransactionPaymentType;
		status: ETransactionStatus;
		identityCode: string;
		fromAccount: ETransactionSourceType;
		toAccount: ETransactionSourceType;
		transactionId: string;
		transactionDate: string;
		requestId: string;
		requestData: Record;
		responseData: Record;
		amount: number;
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
	}
}
