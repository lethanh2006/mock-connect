export enum EThoiGianDot {
	CHUA_DIEN_RA = 'CHUA_DIEN_RA',
	DANG_DIEN_RA = 'DANG_DIEN_RA',
	DA_DIEN_RA = 'DA_DIEN_RA',
}

export const thoiGianDot: Record<EThoiGianDot, string> = {
	[EThoiGianDot.CHUA_DIEN_RA]: 'Chưa bắt đầu',
	[EThoiGianDot.DANG_DIEN_RA]: 'Đang diễn ra',
	[EThoiGianDot.DA_DIEN_RA]: 'Đã kết thúc',
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
	DANH_GIA_TIET_HOC = 'Khảo sát tiết học',
	CUOC_THI = 'CUOC_THI',
}

export enum ELoaiDot {
	BIEU_MAU = 'BIEU_MAU',
	CUOC_THI = 'CUOC_THI',
	DANH_GIA_GIANG_VIEN = 'DANH_GIA_GIANG_VIEN',
}

export enum ELoaiCauHoi {
	SINGLE_CHOICE = 'SingleChoice',
	MULTIPLE_CHOICE = 'MultipleChoice',
	TEXT = 'Text',
	GRID_MULTIPLE_CHOICE = 'GridMultipleChoice',
	GRID_SINGLE_CHOICE = 'GridSingleChoice',
	NUMERIC_RANGE = 'NumericRange',
	RENDER_INPUT_RATING = 'Numberinputrating',
	UPLOAD_FILE = 'UploadFile',
	RENDER_INPUT = 'RenderInput',
}

export enum EVaiTroKhaoSat {
	NHAN_VIEN = 'nhan_vien',
	SINH_VIEN = 'sinh_vien',
	KHAC = 'khac',
}
