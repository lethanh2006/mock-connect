export enum ELoaiThongTinXemSau {
	SU_KIEN = 'SU_KIEN',
	TIN_TUC = 'TIN_TUC',
	VBHD = 'VBHD',
}

export const mapLoaiThongTinXemSau: Record<ELoaiThongTinXemSau, string> = {
	[ELoaiThongTinXemSau.SU_KIEN]: 'Sự kiện',
	[ELoaiThongTinXemSau.TIN_TUC]: 'Tin tức',
	[ELoaiThongTinXemSau.VBHD]: 'Văn bản hướng dẫn',
};
