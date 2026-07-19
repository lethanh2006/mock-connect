export enum TrangThaiDonDangKyHocVuot {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
}

export const trangThaiDonDangKyHocVuotText: Record<TrangThaiDonDangKyHocVuot, string> = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'dangkytinchi.phieudangky.status.CHO_DUYET',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'dangkytinchi.phieudangky.status.overload.DA_DUYET',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'dangkytinchi.phieudangky.status.TU_CHOI',
};

export const trangThaiDonDangKyHocVuotColor = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'blue',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'green',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'red',
};

export const trangThaiDonDangKyHocVuotType: Record<string, 'info' | 'success' | 'error' | 'warning'> = {
	[TrangThaiDonDangKyHocVuot.CHO_DUYET]: 'info',
	[TrangThaiDonDangKyHocVuot.DA_DUYET]: 'success',
	[TrangThaiDonDangKyHocVuot.TU_CHOI]: 'error',
};

export const loaiDangKyVuotTinI18n = 'dangkytinchi.phieudangky.type.overload';
