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

export enum ETrangThaiSinhVienThi {
	DU_DIEU_KIEN = 'Đủ điều kiện',
	KHONG_DU_DIEU_KIEN = 'Không đủ điều kiện',
	HOAN_THI = 'Hoãn thi',
	// CHUA_DUYET = 'Chưa duyệt',
	// KHONG_CO_THONG_TIN = 'Không có thông tin',
}

export const MapKeyColorTrangThaiSinhVienThi: any = {
	[ETrangThaiSinhVienThi.DU_DIEU_KIEN]: 'green',
	[ETrangThaiSinhVienThi.HOAN_THI]: 'yellow',
	// [ETrangThaiSinhVienThi.KHONG_CO_THONG_TIN]: '#939393',
	[ETrangThaiSinhVienThi.KHONG_DU_DIEU_KIEN]: 'red',
	// [ETrangThaiSinhVienThi.CHUA_DUYET]: '#ccc',
};
