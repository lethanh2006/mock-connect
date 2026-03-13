import { ETagColor } from '@/services/base/constant';

export enum EMucDanhGiaTheChat {
	TOT = 'Tốt',
	DAT = 'Đạt',
}

export enum EDoiTuongTheChat {
	TAT_CA = 'Tất cả',
	NAM = 'Nam',
	NU = 'Nữ',
}

export enum EXepLoaiTheChat {
	TOT = 'Tốt',
	DAT = 'Đạt',
	CHUA_DAT = 'Chưa đạt',
	CHUA_DANH_GIA = 'Chưa đánh giá',
}

export const colorXepLoaiTheChat: Record<EXepLoaiTheChat, ETagColor> = {
	[EXepLoaiTheChat.TOT]: ETagColor.GREEN,
	[EXepLoaiTheChat.DAT]: ETagColor.BLUE,
	[EXepLoaiTheChat.CHUA_DAT]: ETagColor.RED,
	[EXepLoaiTheChat.CHUA_DANH_GIA]: ETagColor.PURPLE,
};

export enum EChiSoSoSanh {
	LON = 'Lớn',
	NHO = 'Nhỏ',
	LON_HON_HOAC_BANG = 'Lớn hơn hoặc bằng',
	NHO_HON_HOAC_BANG = 'Nhỏ hơn hoặc bằng',
}
