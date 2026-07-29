export enum EHinhThucHoTro {
	TRA_GOP = 'TRA_GOP',
	TRA_MUON = 'TRA_MUON',
}

export enum ETrangThaiTraGopBill {
	CHO_DUYET = 'CHO_DUYET',
	DANG_TRA_GOP = 'DANG_TRA_GOP',
	TU_CHOI = 'TU_CHOI',
	DA_HOAN_THANH_TRA_GOP = 'DA_HOAN_THANH_TRA_GOP',
}

export enum ETrangThaiPhienTraGop {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
	OVERDUE = 'OVERDUE',
}

export const EMauTrangThaiTraGopBill: Record<ETrangThaiTraGopBill, string> = {
	[ETrangThaiTraGopBill.CHO_DUYET]: 'gold',
	[ETrangThaiTraGopBill.DANG_TRA_GOP]: 'blue',
	[ETrangThaiTraGopBill.TU_CHOI]: 'red',
	[ETrangThaiTraGopBill.DA_HOAN_THANH_TRA_GOP]: 'green',
};

export const EMauTrangThaiPhienTraGop: Record<ETrangThaiPhienTraGop, string> = {
	[ETrangThaiPhienTraGop.UNPAID]: 'default',
	[ETrangThaiPhienTraGop.PAID]: 'green',
	[ETrangThaiPhienTraGop.OVERDUE]: 'red',
};

/** Map mã lỗi trả về từ API `/tra-gop/yeu-cau` sang locale id tương ứng */
export const TRA_GOP_ERROR_MESSAGE_IDS: Record<string, string> = {
	'error-bill-not-found': 'taichinh.tragop.error.bill-not-found',
	'error-tra-gop-not-eligible': 'taichinh.tragop.error.not-eligible',
	'error-tra-gop-request-existed': 'taichinh.tragop.error.request-existed',
	'error-tra-gop-ngay-gia-han-required': 'taichinh.tragop.error.ngay-gia-han-required',
	'error-tra-gop-ngay-gia-han-invalid': 'taichinh.tragop.error.ngay-gia-han-invalid',
	'error-tra-gop-ngay-gia-han-must-be-greater': 'taichinh.tragop.error.ngay-gia-han-must-be-greater',
	'error-tra-gop-so-lan-invalid': 'taichinh.tragop.error.so-lan-invalid',
	'error-tra-gop-so-lan-exceed-max': 'taichinh.tragop.error.so-lan-exceed-max',
};
