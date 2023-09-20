export enum ELoaiMinhChungDiemRenLuyen { // 1.3
	VI_PHAM_NOI_QUY_THI = 'Vi phạm nội quy thi',
	// 2.1.1
	KHONG_DONG_HOC_PHI_THEO_QUY_DINH = 'Không đóng học phí theo quy định',
	// 5.1.1
	BAN_CAN_SU_LOP = 'Ban cán sự lớp',
	// 5.1.2
	PHU_TRACH_DOAN_CLB = 'Phụ trách Đoàn, CLB',
	// 5.2
	THANH_VIEN_CLB_DOI_NHOM = 'Thành viên CLB, đội nhóm',

	// Bổ sung:
	// 1.4
	HOAT_DONG_NGOAI_KHOA = 'Hoạt động ngoại khóa',
	// 2.1.2
	NOI_NGOAI_TRU = 'Nội ngoại trú',
	// 2.3
	THAM_GIA_DINH_HUONG_NGHE_NGHIEP = 'Tham gia định hướng nghề nghiệp',
	// 3.2
	THAM_GIA_CONG_TAC_XA_HOI = 'Tham gia công tác xã hội',
	// 3.3
	TUYEN_TRUYEN_TRUONG_TICH_CUC = 'Tuyên truyền tích cực về Trường/Khoa',
	// 5.3
	THANH_TICH_DAC_BIET = 'Thành tích đặc biệt',
	// 2.2
	THAM_GIA_HOP_LOP_SINH_HOAT = 'Tham gia họp lớp/sinh hoạt',
}

export const locationPathMappingToELoaiMinhChungDiemRenLuyen: Record<string, ELoaiMinhChungDiemRenLuyen> = {
	'noi-ngoai-tru': ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
	'tham-gia-cong-tac-xa-hoi': ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
	'tuyen-truyen': ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
	'dac-biet': ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
	'vi-pham-noi-quy': ELoaiMinhChungDiemRenLuyen.VI_PHAM_NOI_QUY_THI,
	'khong-dong-hoc-phi-theo-quy-dinh': ELoaiMinhChungDiemRenLuyen.KHONG_DONG_HOC_PHI_THEO_QUY_DINH,
	'ban-can-su-lop': ELoaiMinhChungDiemRenLuyen.BAN_CAN_SU_LOP,
	'phu-trach-doan-clb': ELoaiMinhChungDiemRenLuyen.PHU_TRACH_DOAN_CLB,
	'thanh-vien-clb-doi-nhom': ELoaiMinhChungDiemRenLuyen.THANH_VIEN_CLB_DOI_NHOM,
};

export const ELoaiMinhChungDiemRenLuyenMappingToTitle: Record<ELoaiMinhChungDiemRenLuyen, string> = {
	[ELoaiMinhChungDiemRenLuyen.VI_PHAM_NOI_QUY_THI]: 'Vi phạm nội quy thi',
	[ELoaiMinhChungDiemRenLuyen.KHONG_DONG_HOC_PHI_THEO_QUY_DINH]: 'Không đóng học phí theo quy định',
	[ELoaiMinhChungDiemRenLuyen.BAN_CAN_SU_LOP]: 'Ban cán sự lớp',
	[ELoaiMinhChungDiemRenLuyen.PHU_TRACH_DOAN_CLB]: 'Phụ trách Đoàn, CLB',
	[ELoaiMinhChungDiemRenLuyen.THANH_VIEN_CLB_DOI_NHOM]: 'Thành viên CLB, đội nhóm',
	[ELoaiMinhChungDiemRenLuyen.HOAT_DONG_NGOAI_KHOA]: '',
	[ELoaiMinhChungDiemRenLuyen.THAM_GIA_DINH_HUONG_NGHE_NGHIEP]: '',
	[ELoaiMinhChungDiemRenLuyen.THAM_GIA_HOP_LOP_SINH_HOAT]: '',
	[ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU]: 'Nội ngoại trú',
	[ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI]: 'Tham gia công tác xã hội',
	[ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC]: 'Tuyên truyền tích cực về Trường/Khoa',
	[ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET]: 'Thành tích đặc biệt',
};

export enum ETrangThaiMinhChungDiemRenLuyen {
	CHO_DUYET = 'Chờ duyệt',
	KHONG_DUYET = 'Không duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const ColorTrangThaiMinhChungDiemRenLuyen = {
	[ETrangThaiMinhChungDiemRenLuyen.CHO_DUYET]: 'blue',
	[ETrangThaiMinhChungDiemRenLuyen.DA_DUYET]: 'green',
	[ETrangThaiMinhChungDiemRenLuyen.KHONG_DUYET]: 'red',
};

export enum ELoaiChucDanhLop {
	LOP_TRUONG = 'Lớp trưởng',
	LOP_PHO = 'Lớp phó',
}

export enum ELoaiViPhamQuyCheThi {
	LOAI_1 = 1,
	LOAI_2 = 2,
	LOAI_3 = 3,
	LOAI_4 = 4,
}

export const MapELoaiViPhamQuyCheThi: Record<ELoaiViPhamQuyCheThi, string> = {
	[ELoaiViPhamQuyCheThi.LOAI_1]: 'Không đủ điều kiện dự thi/bị cấm thi cho mỗi học phần (lý thuyết/thực hành)',
	[ELoaiViPhamQuyCheThi.LOAI_2]: 'Bị lập biên bản khiển trách khi thi kết thúc học phần',
	[ELoaiViPhamQuyCheThi.LOAI_3]: 'Bị lập biên bản cảnh báo khi thi kết thúc học phần',
	[ELoaiViPhamQuyCheThi.LOAI_4]: 'Bị lập biên bản đành chỉ thi kết thúc học phần',
};

// NỘI NGOẠI TRÚ
export enum EPhanLoaiNoiNgoaiTru {
	NGOAI_TRU = 'ngoai_tru',
	NOI_TRU = 'noi_tru',
}

export const EPhanLoaiNoiNgoaiTruMappingToLabel = {
	[EPhanLoaiNoiNgoaiTru.NGOAI_TRU]: 'Ngoại trú',
	[EPhanLoaiNoiNgoaiTru.NOI_TRU]: 'Nội trú',
};

export enum ENguoiGui {
	SINH_VIEN = 'Sinh viên',
	CO_VAN_HOC_TAP = 'Cố vấn học tập',
	CHUYEN_VIEN = 'Chuyên viên',
}
