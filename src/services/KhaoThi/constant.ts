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

export enum ETrangThaiThi {
	CHUA_DUYET = 'Chưa duyệt',
	DU_DIEU_KIEN = 'Đủ điều kiện',
	KHONG_DU = 'Không đủ điều kiện',
	HOAN_THI = 'Hoãn thi',
}

export const colorTrangThaiThi: Record<ETrangThaiThi, string> = {
	[ETrangThaiThi.CHUA_DUYET]: 'default',
	[ETrangThaiThi.DU_DIEU_KIEN]: 'green',
	[ETrangThaiThi.KHONG_DU]: 'red',
	[ETrangThaiThi.HOAN_THI]: 'orange',
};
