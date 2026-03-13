export enum EDoiTuongNhap {
	CAN_BO = 'CAN_BO',
	SINH_VIEN = 'SINH_VIEN',
}

export const MapEDoiTuongNhap = {
	[EDoiTuongNhap.CAN_BO]: 'Cán bộ',
	[EDoiTuongNhap.SINH_VIEN]: 'Sinh viên',
};

export enum ELoaiMinhChung {
	Y_THUC_HOC_TAP = 'Y_THUC_HOC_TAP',
	Y_THUC_CHAP_HANH_NOI_QUY = 'Y_THUC_CHAP_HANH_NOI_QUY',
	Y_THUC_HOAT_DONG_XA_HOI = 'Y_THUC_HOAT_DONG_XA_HOI',
	Y_THUC_CONG_DAN = 'Y_THUC_CONG_DAN',
	Y_THUC_PHU_TRACH = 'Y_THUC_PHU_TRACH',
}
export const MapELoaiMinhChung = {
	[ELoaiMinhChung.Y_THUC_CHAP_HANH_NOI_QUY]: 'Ý thức chấp hành nội quy',
	[ELoaiMinhChung.Y_THUC_HOC_TAP]: 'Ý thức học tập',
	[ELoaiMinhChung.Y_THUC_HOAT_DONG_XA_HOI]: 'Ý thức hoạt động xã hội',
	[ELoaiMinhChung.Y_THUC_CONG_DAN]: 'Ý thức công dân',
	[ELoaiMinhChung.Y_THUC_PHU_TRACH]: 'Ý thức phụ trách',
};
