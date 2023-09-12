export enum EMaTrangThaiThanhToan {
	CHUA_THANH_TOAN = 'open',
	CHUA_THANH_TOAN_DU = 'underpaid',
	DA_THANH_TOAN_DU = 'paid',
	THANH_TOAN_THUA = 'overpaid',
	DONG = 'closed',
}

export const ETrangThaiThanhToan = {
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
