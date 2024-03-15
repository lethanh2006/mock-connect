export enum ELoaiNhuCauHocPhan {
	KHHT_CHUAN = 'Theo kế hoạch học tập chuẩn',
	NGOAI_CT = 'Ngoài chương trình đào tạo',
	HOC_LAI = 'Học lại',
	HOC_CAI_THIEN = 'Học cải thiện',
	HOC_VUOT = 'Học vượt',
	HOC_VB2 = 'Học văn bằng 2',
}

export enum ELoaiHocPhanCTDT {
	BAT_BUOC = 'Bắt buộc',
	TU_CHON = 'Tự chọn',
	TOT_NGHIEP = 'Tốt nghiệp',
}

// Trạng thái học tập trong tiến trình học tập
export enum ETrangThaiHocTap {
	CHUA_HOC = 'CHUA_HOC',
	DANG_HOC = 'DANG_HOC',
	DA_HOC = 'DA_DAT',
	CHUA_DAT = 'CHUA_DAT',
}

export const trangThaiHocTap: Record<ETrangThaiHocTap, string> = {
	[ETrangThaiHocTap.CHUA_HOC]: 'Chưa học',
	[ETrangThaiHocTap.DANG_HOC]: 'Đang học',
	[ETrangThaiHocTap.DA_HOC]: 'Đã học',
	[ETrangThaiHocTap.CHUA_DAT]: 'Chưa đạt',
};

export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EPhuongThucTinhDiem {
	DAT = 'Đạt',
	BAC = 'Theo bậc',
	DIEM = 'Tính điểm',
}

export enum ETrangThaiHocSv {
	CHUA_PHAN_LOP = 'Chưa phân lớp',
	DANG_HOC = 'Đang học',
	THOI_HOC = 'Thôi học',
	BUOC_THOI_HOC = 'Buộc thôi học',
	BAO_LUU = 'Bảo lưu',
	DA_TOT_NGHIEP = 'Đã tốt nghiệp',
}

export const colorTrangThaiHocSv: Record<ETrangThaiHocSv, string> = {
	[ETrangThaiHocSv.CHUA_PHAN_LOP]: 'gray',
	[ETrangThaiHocSv.DANG_HOC]: 'blue',
	[ETrangThaiHocSv.THOI_HOC]: 'red',
	[ETrangThaiHocSv.BUOC_THOI_HOC]: 'violet',
	[ETrangThaiHocSv.BAO_LUU]: 'orange',
	[ETrangThaiHocSv.DA_TOT_NGHIEP]: 'green',
};
