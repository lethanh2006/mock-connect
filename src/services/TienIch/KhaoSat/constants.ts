export enum EThoiGianDot {
	CHUA_DIEN_RA = 'CHUA_DIEN_RA',
	DANG_DIEN_RA = 'DANG_DIEN_RA',
	DA_DIEN_RA = 'DA_DIEN_RA',
}

export const thoiGianDot: Record<EThoiGianDot, string> = {
	[EThoiGianDot.CHUA_DIEN_RA]: 'Chưa diễn ra',
	[EThoiGianDot.DANG_DIEN_RA]: 'Đang diễn ra',
	[EThoiGianDot.DA_DIEN_RA]: 'Đã diễn ra',
};

export const textThucHienKhaoSat: Record<EThoiGianDot, string> = {
	[EThoiGianDot.CHUA_DIEN_RA]: 'Khảo sát chưa bắt đầu',
	[EThoiGianDot.DANG_DIEN_RA]: 'Thực hiện khảo sát',
	[EThoiGianDot.DA_DIEN_RA]: 'Khảo sát đã kết thúc',
};

export enum ELoaiBieuMau {
	KHAO_SAT = 'Khảo sát',
	TRAC_NGHIEM = 'Trắc nghiệm',
	KHAI_BAO_Y_TE = 'Khai báo y tế',
	DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
}

export enum ELoaiDot {
	BIEU_MAU = 'BIEU_MAU',
	DANH_GIA_GIANG_VIEN = 'DANH_GIA_GIANG_VIEN',
}

export enum ELoaiCauHoi {
	SINGLE_CHOICE = 'SingleChoice',
	MULTIPLE_CHOICE = 'MultipleChoice',
	TEXT = 'Text',
	GRID_MULTIPLE_CHOICE = 'GridMultipleChoice',
	GRID_SINGLE_CHOICE = 'GridSingleChoice',
	NUMERIC_RANGE = 'NumericRange',
	UPLOAD_FILE = 'UploadFile',
}
