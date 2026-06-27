export enum ELogAction {
	THEM_DOT_CAP_NHAT_HOC_BA = 'THEM_DOT_CAP_NHAT_HOC_BA',
	// SUA_DOT_CAP_NHAT_HOC_BA = 'SUA_DOT_CAP_NHAT_HOC_BA',
	// XOA_DOT_CAP_NHAT_HOC_BA = 'XOA_DOT_CAP_NHAT_HOC_BA',
	// KHOI_TAO_DANH_SACH_HOC_BA = 'KHOI_TAO_DANH_SACH_HOC_BA',
	// DONG_BO_THONG_TIN_HOC_BA_SINH_VIEN = 'DONG_BO_THONG_TIN_HOC_BA_SINH_VIEN',

	// CO_VAN_CHO_Y_KIEN_HOC_BA = 'CO_VAN_CHO_Y_KIEN_HOC_BA',
	// CHUYEN_VIEN_DUYET_HOC_BA = 'CHUYEN_VIEN_DUYET_HOC_BA',
}

export const logAction: Record<ELogAction, string> = {
	[ELogAction.THEM_DOT_CAP_NHAT_HOC_BA]: 'Khởi tạo đợt học bạ',
	// [ELogAction.SUA_DOT_CAP_NHAT_HOC_BA]: '',
	// [ELogAction.XOA_DOT_CAP_NHAT_HOC_BA]: '',
	// [ELogAction.KHOI_TAO_DANH_SACH_HOC_BA]: '',
	// [ELogAction.DONG_BO_THONG_TIN_HOC_BA_SINH_VIEN]: '',
	// [ELogAction.CO_VAN_CHO_Y_KIEN_HOC_BA]: '',
	// [ELogAction.CHUYEN_VIEN_DUYET_HOC_BA]: '',
};

export enum ELogActionDktc {
	SV_DK_LTC = 'SV_DK_LTC',
	SV_DEL_DK_LTC = 'SV_DEL_DK_LTC',
	ADM_DEL_SV_LTC = 'ADM_DEL_SV_LTC',
	ADM_SWAP_SV_LTC = 'ADM_SWAP_SV_LTC',
	ADM_DEL_PHIEU_DK_LTC = 'ADM_DEL_PHIEU_DK_LTC',
}

export const logActionDktc: Record<ELogActionDktc, string> = {
	[ELogActionDktc.SV_DK_LTC]: 'dangkytinchi.lichsuthaotac.action.svRegister',
	[ELogActionDktc.SV_DEL_DK_LTC]: 'dangkytinchi.lichsuthaotac.action.svDelete',
	[ELogActionDktc.ADM_DEL_SV_LTC]: 'dangkytinchi.lichsuthaotac.action.staffDelete',
	[ELogActionDktc.ADM_SWAP_SV_LTC]: 'dangkytinchi.lichsuthaotac.action.staffRegister',
	[ELogActionDktc.ADM_DEL_PHIEU_DK_LTC]: 'dangkytinchi.lichsuthaotac.action.staffDelete',
};

export const colorLogActionDktc: Record<ELogActionDktc, string> = {
	[ELogActionDktc.SV_DK_LTC]: '#389e0d',
	[ELogActionDktc.SV_DEL_DK_LTC]: 'red',
	[ELogActionDktc.ADM_DEL_SV_LTC]: 'red',
	[ELogActionDktc.ADM_SWAP_SV_LTC]: 'yellow',
	[ELogActionDktc.ADM_DEL_PHIEU_DK_LTC]: 'red',
};
