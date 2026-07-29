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
