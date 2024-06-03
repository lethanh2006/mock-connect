export enum EDKDTCongNo {
	DU = 'Đủ',
	CHUA_DU = 'Chưa đủ',
	MIEN = 'Miễn',
}

export const colorDKDTCongNo: Record<EDKDTCongNo, string> = {
	[EDKDTCongNo.DU]: 'green',
	[EDKDTCongNo.CHUA_DU]: 'orange',
	[EDKDTCongNo.MIEN]: 'purple',
};

export enum EDKDTKetQuaHocTap {
	CHUA_DUYET = 'Chưa duyệt',
	DAT = 'Đạt',
	KHONG_DAT = 'Không đạt',
}

export const colorDKDTKetQuaHocTap: Record<EDKDTKetQuaHocTap, string> = {
	[EDKDTKetQuaHocTap.CHUA_DUYET]: 'orange',
	[EDKDTKetQuaHocTap.DAT]: 'green',
	[EDKDTKetQuaHocTap.KHONG_DAT]: 'red',
};
