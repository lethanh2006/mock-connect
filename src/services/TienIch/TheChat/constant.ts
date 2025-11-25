import { ETagColor } from '@/services/base/constant';

export enum EMucDanhGiaTheChat {
	TOT = 'Tốt',
	DAT = 'Đạt',
}

export enum EDonViDoLuongTheChat {
	LAN = 'lần',
	GIAY = 'giây',
	LAN_30_GIAY = 'lần/30 giây',
	MET = 'mét',
	KG = 'kg',
	CM = 'cm',
	KHAC = 'Khác',
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
	KHONG_DANH_GIA = 'Không đánh giá',
}

export const colorXepLoaiTheChat: Record<EXepLoaiTheChat, ETagColor> = {
	[EXepLoaiTheChat.TOT]: ETagColor.GREEN,
	[EXepLoaiTheChat.DAT]: ETagColor.BLUE,
	[EXepLoaiTheChat.CHUA_DAT]: ETagColor.RED,
	[EXepLoaiTheChat.CHUA_DANH_GIA]: ETagColor.PURPLE,
	[EXepLoaiTheChat.KHONG_DANH_GIA]: ETagColor.DEFAULT,
};
