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

export const placeOfBirthTypeMessageIds: Partial<Record<ELoaiNoiSinh, string>> = {
	[ELoaiNoiSinh.TRONG_NUOC]: 'thongtincanhan.hoso.enum.loainoisinh.trongNuoc',
	[ELoaiNoiSinh.NUOC_NGOAI]: 'thongtincanhan.hoso.enum.loainoisinh.nuocNgoai',
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
	ANH_CHI_EM = 'Anh/Chị/Em',
	CON = 'Con',
	VO_CHONG = 'Vợ/Chồng',
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
	LOP_TRUONG = 'lop_truong',
	LOP_PHO = 'lop_pho',
	THANH_VIEN = 'thanh_vien',
	// LOP_PHO_DOI_SONG = 'lop_pho_doi_song',
	// LOP_PHO_HOC_TAP = 'lop_pho_hoc_tap',
}

export const vaiTroSvLhc: Record<EVaiTroSvLhc, string> = {
	[EVaiTroSvLhc.LOP_TRUONG]: 'Lớp trưởng',
	[EVaiTroSvLhc.LOP_PHO]: 'Lớp phó',
	[EVaiTroSvLhc.THANH_VIEN]: 'Thành viên',
	// [EVaiTroSvLhc.LOP_PHO_DOI_SONG]: 'Lớp phó đời sống',
	// [EVaiTroSvLhc.LOP_PHO_HOC_TAP]: 'Lớp phó học tập',
};

// Số lần nhập cảnh visa
export enum SoLanNhapCanhVisa {
	SINGLE = 'single',
	DOUBLE = 'double',
	MULTIPLE = 'multiple',
}

export const TenSoLanNhapCanhVisa: Record<SoLanNhapCanhVisa, string> = {
	[SoLanNhapCanhVisa.SINGLE]: 'thongtincanhan.form.thongtinvisa.solannhapcanh.single',
	[SoLanNhapCanhVisa.DOUBLE]: 'thongtincanhan.form.thongtinvisa.solannhapcanh.double',
	[SoLanNhapCanhVisa.MULTIPLE]: 'thongtincanhan.form.thongtinvisa.solannhapcanh.multiple',
};

export enum EnrollmentStatus {
	ADMITTED = 'Admitted',
	ENROLLED = 'Enrolled',
}

export enum ETrangThaiGiayToNhapHoc {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	KHONG_DUYET = 'KHONG_DUYET',
}

export const nameTrangThaiGiayToNhapHoc: Record<ETrangThaiGiayToNhapHoc, string> = {
	[ETrangThaiGiayToNhapHoc.CHO_DUYET]: 'global.enrollmentDeclaration.docTable.status.CHO_DUYET',
	[ETrangThaiGiayToNhapHoc.DA_DUYET]: 'global.enrollmentDeclaration.docTable.status.DA_DUYET',
	[ETrangThaiGiayToNhapHoc.KHONG_DUYET]: 'global.enrollmentDeclaration.docTable.status.KHONG_DUYET',
};

export const colorTrangThaiGiayToNhapHoc: Record<ETrangThaiGiayToNhapHoc, string> = {
	[ETrangThaiGiayToNhapHoc.CHO_DUYET]: 'blue',
	[ETrangThaiGiayToNhapHoc.DA_DUYET]: 'green',
	[ETrangThaiGiayToNhapHoc.KHONG_DUYET]: 'red',
};
