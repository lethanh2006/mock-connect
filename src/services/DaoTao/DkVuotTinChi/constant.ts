export enum TrangThaiDonDangKyHocVuot {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
}

export const trangThaiDonDangKyHocVuotText = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'Chờ duyệt',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'Đã duyệt',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'Từ chối',
	[TrangThaiDonDangKyHocVuot.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
};

export const trangThaiDonDangKyHocVuotColor = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'blue',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'green',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'red',
	[TrangThaiDonDangKyHocVuot.YEU_CAU_CHINH_SUA]: 'orange',
};

export const trangThaiDonDangKyHocVuotType: Record<string, 'info' | 'success' | 'error' | 'warning'> = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'info',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'success',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'error',
	[TrangThaiDonDangKyHocVuot.YEU_CAU_CHINH_SUA]: 'info',
};
