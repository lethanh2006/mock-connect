export enum EMaTrangThaiThanhToan {
	CHUA_THANH_TOAN = 'open',
	CHUA_THANH_TOAN_DU = 'underpaid',
	DA_THANH_TOAN_DU = 'paid',
	THANH_TOAN_THUA = 'overpaid',
	DONG = 'closed',
}

export const ETrangThaiThanhToan: any = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'Chưa thanh toán',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'Chưa thanh toán đủ',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'Đã thanh toán đủ',
	[EMaTrangThaiThanhToan.THANH_TOAN_THUA]: 'Thanh toán thừa',
	[EMaTrangThaiThanhToan.DONG]: 'Đóng',
};

export const EMauTrangThaiThanhToanTable = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'red',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'gold',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'green',
	[EMaTrangThaiThanhToan.THANH_TOAN_THUA]: 'orange',
	[EMaTrangThaiThanhToan.DONG]: undefined,
};

export enum ELoaiThanhToan {
	bank = 'bank',
	manual = 'manual',
}

export const MapKeyLoaiThanhToan = {
	[ELoaiThanhToan.bank]: 'Thanh toán bằng mã định danh',
	[ELoaiThanhToan.manual]: 'Chuyên viên cập nhật',
};

//Giao dịch
export enum ETransactionType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
	INTERNAL = 'internal',
}

export enum ETransactionPaymentType {
	BANK = 'bank',
	MANUAL = 'manual',
	MOMO_WALLET = 'momo-wallet',
}

export const transactionPaymentLabel: Record<ETransactionPaymentType, string> = {
	[ETransactionPaymentType.BANK]: 'Chuyển khoản ngân hàng',
	[ETransactionPaymentType.MANUAL]: 'Chuyên viên cập nhật',
	[ETransactionPaymentType.MOMO_WALLET]: 'Ví Momo',
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
	[ETransactionStatus.PENDING]: 'Đang xử lý',
	[ETransactionStatus.SUCCESS]: 'Thành công',
	[ETransactionStatus.FAIL]: 'Không thành công',
	[ETransactionStatus.CANCEL]: 'Đã hủy',
};

export const colorTransactionStatus: Record<ETransactionStatus, string> = {
	[ETransactionStatus.PENDING]: 'blue',
	[ETransactionStatus.SUCCESS]: 'green',
	[ETransactionStatus.FAIL]: 'red',
	[ETransactionStatus.CANCEL]: 'purple',
};
