export enum EMaTrangThaiThanhToan {
	CHUA_THANH_TOAN = 'open',
	CHUA_THANH_TOAN_DU = 'underpaid',
	DA_THANH_TOAN_DU = 'paid',
	CHUA_HOAN_THANH_COC = 'deposit_pending',
	DA_HOAN_THANH_COC = 'deposit_paid',
	DONG = 'closed',
}

export const ETrangThaiThanhToan: any = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'Chưa thanh toán',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'Chưa thanh toán đủ',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'Đã thanh toán đủ',
	[EMaTrangThaiThanhToan.CHUA_HOAN_THANH_COC]: 'Chưa hoàn thành cọc',
	[EMaTrangThaiThanhToan.DA_HOAN_THANH_COC]: 'Đã hoàn thành cọc',
	[EMaTrangThaiThanhToan.DONG]: 'Đóng',
};

export const EMauTrangThaiThanhToanTable = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'rgb(220, 53, 69)',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'rgb(255, 215, 34)',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'rgb(0, 128, 16)',
	[EMaTrangThaiThanhToan.CHUA_HOAN_THANH_COC]: 'rgb(250, 140, 22)',
	[EMaTrangThaiThanhToan.DA_HOAN_THANH_COC]: 'rgb(24, 144, 255)',
	[EMaTrangThaiThanhToan.DONG]: undefined,
};

export const ETrangThaiThanhToanKtxI18n: Record<EMaTrangThaiThanhToan, string> = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'kytucxa.lichsu.status.unpaid',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'kytucxa.lichsu.status.underpaid',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'kytucxa.lichsu.status.paid',
	[EMaTrangThaiThanhToan.CHUA_HOAN_THANH_COC]: 'kytucxa.lichsu.status.depositPending',
	[EMaTrangThaiThanhToan.DA_HOAN_THANH_COC]: 'kytucxa.lichsu.status.depositPaid',
	[EMaTrangThaiThanhToan.DONG]: 'kytucxa.lichsu.status.closed',
};

//Giao dịch
export enum ETransactionType {
	CHARGE = 'CHARGE',
	PAYMENT = 'PAYMENT',
	DISCOUNT = 'DISCOUNT',
	DEPOSIT_CREDIT = 'DEPOSIT_CREDIT',
	WALLET_PAYMENT = 'WALLET_PAYMENT',
	DISCOUNT_LATE = 'DISCOUNT_LATE',
	DEPOSIT_CLEARING = 'DEPOSIT_CLEARING',
	FORFEITURE = 'FORFEITURE',
	REVERSE = 'REVERSE',
	PENALTY_CHARGE = 'PENALTY_CHARGE',
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
	INTERNAL = 'internal',
	REFUND = 'refund',
}

export const transactionType: Record<ETransactionType, string> = {
	[ETransactionType.CHARGE]: 'CHARGE',
	[ETransactionType.PAYMENT]: 'PAYMENT',
	[ETransactionType.DISCOUNT]: 'DISCOUNT',
	[ETransactionType.DEPOSIT_CREDIT]: 'DEPOSIT_CREDIT',
	[ETransactionType.WALLET_PAYMENT]: 'WALLET_PAYMENT',
	[ETransactionType.DISCOUNT_LATE]: 'DISCOUNT_LATE',
	[ETransactionType.DEPOSIT_CLEARING]: 'DEPOSIT_CLEARING',
	[ETransactionType.FORFEITURE]: 'FORFEITURE',
	[ETransactionType.REVERSE]: 'REVERSE',
	[ETransactionType.PENALTY_CHARGE]: 'PENALTY_CHARGE',
	[ETransactionType.DEPOSIT]: 'DEPOSIT',
	[ETransactionType.WITHDRAW]: 'WITHDRAW',
	[ETransactionType.INTERNAL]: 'INTERNAL',
	[ETransactionType.REFUND]: 'REFUND',
};

export const colorTransactionType: Record<ETransactionType, string> = {
	[ETransactionType.CHARGE]: 'blue',
	[ETransactionType.PAYMENT]: 'green',
	[ETransactionType.DISCOUNT]: 'gold',
	[ETransactionType.DEPOSIT_CREDIT]: 'cyan',
	[ETransactionType.WALLET_PAYMENT]: 'green',
	[ETransactionType.DISCOUNT_LATE]: 'gold',
	[ETransactionType.DEPOSIT_CLEARING]: 'geekblue',
	[ETransactionType.FORFEITURE]: 'red',
	[ETransactionType.REVERSE]: 'volcano',
	[ETransactionType.PENALTY_CHARGE]: 'red',
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
