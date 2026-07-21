export enum TrangThaiDonDangKyHocDuThinh {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
}

export const trangThaiDonDangKyHocDuThinhText: Record<TrangThaiDonDangKyHocDuThinh, string> = {
	[TrangThaiDonDangKyHocDuThinh.CHO_DUYET]: 'dangkytinchi.phieudangky.status.CHO_DUYET',
	[TrangThaiDonDangKyHocDuThinh.DA_DUYET]: 'dangkytinchi.phieudangky.status.audit.DA_DUYET',
	[TrangThaiDonDangKyHocDuThinh.TU_CHOI]: 'dangkytinchi.phieudangky.status.TU_CHOI',
};

export const trangThaiDonDangKyHocDuThinhColor = {
	[TrangThaiDonDangKyHocDuThinh.CHO_DUYET]: 'blue',
	[TrangThaiDonDangKyHocDuThinh.DA_DUYET]: 'green',
	[TrangThaiDonDangKyHocDuThinh.TU_CHOI]: 'red',
};

export const loaiDangKyDuThinhI18n = 'dangkytinchi.phieudangky.type.audit';
