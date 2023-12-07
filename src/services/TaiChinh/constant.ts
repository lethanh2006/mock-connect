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

export const EMauTrangThaiThanhToanTable: any = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: '#dc3545',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: '#ffca2c',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: '#1fba36',
	[EMaTrangThaiThanhToan.THANH_TOAN_THUA]: '#f3682bc2',
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
