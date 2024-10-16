export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EHinhThucTuyenDung {
	THI_TUYEN = 'Thi tuyển',
	XET_TUYEN = 'Xét tuyển',
	HOP_DONG = 'Hơp đồng',
	BIET_PHAI = 'Biệt phái',
	DIEU_DONG = 'Điều động',
}

export enum EViTriViecLam {
	DUNG_NGANH = 'Có việc làm đúng ngành đào tạo',
	LIEN_QUAN = 'Có việc làm liên quan đến ngành đào tạo',
	KHONG_LIEN_QUAN = 'Có việc làm không liên quan đến ngành đào tạo',
	TIEP_TUC_HOC = 'Tiếp tục học',
	CHUA_CO = 'Chưa có việc làm',
}

export enum ENoiNgoaiTru {
	NOI_TRU = 'Nội trú',
	NGOAI_TRU = 'Ngoại trú',
}

export enum ELoaiNoiSinh {
	TRONG_NUOC = 'TRONG_NUOC',
	NUOC_NGOAI = 'NUOC_NGOAI',
}

export const TenLoaiNoiSinh: Record<ELoaiNoiSinh, string> = {
	[ELoaiNoiSinh.TRONG_NUOC]: 'Trong nước',
	[ELoaiNoiSinh.NUOC_NGOAI]: 'Nước ngoài',
};

export enum ETrangThaiThanhVienGiaDinh {
	DA_MAT = 'Đã mất',
	CO_THONG_TIN = 'Có thông tin',
	KHONG_CO_THONG_TIN = 'Không có thông tin',
}

export enum ELoaiThanhVienGiaDinh {
	BO = 'Bố',
	ME = 'Mẹ',
	NGUOI_GIAM_HO = 'Người giám hộ',
	ANH = 'Anh trai',
	CHI = 'Chị gái',
	EM_TRAI = 'Em trai',
	EM_GAI = 'Em gái',
	NGUOI_LIEN_HE = 'Người liên hệ',
}

export enum ELoaiThoiHanChungChi {
	CO_THOI_HAN = 'Có thời hạn',
	KHONG_CO_THOI_HAN = 'Không có thời hạn',
}

export enum ETrangThaiChungChiSinhVen {
	CHO_DUYET = 'CHO_DUYET',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
	DA_DUYET = 'DA_DUYET',
	KHONG_DUYET = 'KHONG_DUYET',
}

export const nameTrangThaiChungChiSinhVen: Record<ETrangThaiChungChiSinhVen, string> = {
	[ETrangThaiChungChiSinhVen.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiChungChiSinhVen.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
	[ETrangThaiChungChiSinhVen.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiChungChiSinhVen.KHONG_DUYET]: 'Không duyệt',
};

export const colorTrangThaiChungChiSinhVen: Record<ETrangThaiChungChiSinhVen, string> = {
	[ETrangThaiChungChiSinhVen.CHO_DUYET]: 'blue',
	[ETrangThaiChungChiSinhVen.YEU_CAU_CHINH_SUA]: 'orange',
	[ETrangThaiChungChiSinhVen.DA_DUYET]: 'green',
	[ETrangThaiChungChiSinhVen.KHONG_DUYET]: 'red',
};

// Vai trò sinh viên trong lớp hành chính

export enum EVaiTroSvLhc {
	THANH_VIEN = 'thanh_vien',
	LOP_TRUONG = 'lop_truong',
	LOP_PHO = 'lop_pho',
	LOP_PHO_DOI_SONG = 'lop_pho_doi_song',
	LOP_PHO_HOC_TAP = 'lop_pho_hoc_tap',
}

export const vaiTroSvLhc: Record<EVaiTroSvLhc, string> = {
	[EVaiTroSvLhc.THANH_VIEN]: 'Thành viên',
	[EVaiTroSvLhc.LOP_TRUONG]: 'Lớp trưởng',
	[EVaiTroSvLhc.LOP_PHO]: 'Lớp phó',
	[EVaiTroSvLhc.LOP_PHO_DOI_SONG]: 'Lớp phó đời sống',
	[EVaiTroSvLhc.LOP_PHO_HOC_TAP]: 'Lớp phó học tập',
};
