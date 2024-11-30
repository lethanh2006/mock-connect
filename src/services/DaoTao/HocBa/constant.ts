export enum ETrangThaiHocBa {
	CHO_XU_LY = 'Chờ xử lý',
	CO_VAN_XAC_NHAN = 'Cố vấn xác nhận',
	// CTSV_XAC_NHAN = 'CTSV xác nhận',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiHocBa: Record<ETrangThaiHocBa, string> = {
	[ETrangThaiHocBa.CHO_XU_LY]: 'blue',
	[ETrangThaiHocBa.CO_VAN_XAC_NHAN]: 'orange',
	// [ETrangThaiHocBa.CTSV_XAC_NHAN]: 'purple',
	[ETrangThaiHocBa.KHONG_DUYET]: 'red',
};
