export enum EMaTrangThaiThanhToan {
	CHUA_THANH_TOAN = 'open',
	CHUA_THANH_TOAN_DU = 'underpaid',
	DA_THANH_TOAN_DU = 'paid',
	DONG = 'closed',
}

export const ETrangThaiThanhToan: any = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'Chưa thanh toán',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'Chưa thanh toán đủ',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'Đã thanh toán đủ',
	[EMaTrangThaiThanhToan.DONG]: 'Đóng',
};

export const EMauTrangThaiThanhToanTable = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'rgb(220, 53, 69)',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'rgb(255, 215, 34)',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'rgb(0, 128, 16)',
	[EMaTrangThaiThanhToan.DONG]: undefined,
};

//Giao dịch
export enum ETransactionType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
	INTERNAL = 'internal',
	REFUND = 'refund',
}

export const transactionType: Record<ETransactionType, string> = {
	[ETransactionType.DEPOSIT]: 'Nộp tiền',
	[ETransactionType.WITHDRAW]: 'Rút tiền',
	[ETransactionType.INTERNAL]: 'Thanh toán',
	[ETransactionType.REFUND]: 'Hoàn trả',
};

export const colorTransactionType: Record<ETransactionType, string> = {
	[ETransactionType.DEPOSIT]: 'green',
	[ETransactionType.WITHDRAW]: 'yellow',
	[ETransactionType.INTERNAL]: 'purple',
	[ETransactionType.REFUND]: 'default',
};

export enum ETransactionPaymentType {
	BANK = 'bank',
	MANUAL = 'manual',
	MOMO_WALLET = 'momo-wallet',
	INTERNAL = 'internal',
}

export const transactionPaymentLabel: Record<ETransactionPaymentType, string> = {
	[ETransactionPaymentType.BANK]: 'Chuyển khoản ngân hàng',
	[ETransactionPaymentType.MANUAL]: 'Chuyên viên cập nhật',
	[ETransactionPaymentType.MOMO_WALLET]: 'Ví Momo',
	[ETransactionPaymentType.INTERNAL]: 'Hệ thống',
};

export enum ETransactionSourceType {
	EXTERNAL = 'external',
	WALLET = 'wallet',
	SYSTEM = 'system',
}

export enum ETransactionStatus {
	PENDING = 'pending',
	SUCCESS = 'success',
	FAIL = 'fail',
	CANCEL = 'cancel',
}

export const transactionStatus: Record<ETransactionStatus, string> = {
	[ETransactionStatus.PENDING]: 'Đang thực hiện',
	[ETransactionStatus.SUCCESS]: 'Thành công',
	[ETransactionStatus.FAIL]: 'Không thành công',
	[ETransactionStatus.CANCEL]: 'Đã hủy',
};

export const colorTransactionStatus: Record<ETransactionStatus, string> = {
	[ETransactionStatus.PENDING]: 'blue',
	[ETransactionStatus.SUCCESS]: 'green',
	[ETransactionStatus.FAIL]: 'red',
	[ETransactionStatus.CANCEL]: 'default',
};

/** Nhãn tiếng Việt cho loại giao dịch */
export const TRANSACTION_LABEL: Record<string, string> = {
	CHARGE: 'Ghi nợ',
	PAYMENT: 'Thanh toán',
	DISCOUNT: 'Khuyến mại',
	DEPOSIT_CREDIT: 'Ghi có ký quỹ',
	WALLET_PAYMENT: 'Thanh toán ví',
	DISCOUNT_LATE: 'Giảm trễ hạn',
	DEPOSIT_CLEARING: 'Cấn trừ ký quỹ',
	FORFEITURE: 'Tịch thu',
	REVERSE: 'Đảo giao dịch',
	PENALTY_CHARGE: 'Phí phạt',
	deposit: 'Nộp tiền',
	withdraw: 'Rút tiền',
	internal: 'Nội bộ',
	refund: 'Hoàn trả',
};

/** Màu Tag cho loại giao dịch */
export const TRANSACTION_COLOR: Record<string, string> = {
	CHARGE: 'blue',
	PAYMENT: 'green',
	DISCOUNT: 'gold',
	DEPOSIT_CREDIT: 'cyan',
	WALLET_PAYMENT: 'green',
	DISCOUNT_LATE: 'gold',
	DEPOSIT_CLEARING: 'geekblue',
	FORFEITURE: 'red',
	REVERSE: 'volcano',
	PENALTY_CHARGE: 'red',
	deposit: 'green',
	withdraw: 'orange',
	internal: 'purple',
	refund: 'default',
};