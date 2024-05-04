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

//Đăng ký nhu cầu
export enum ETrangThaiHocPhanDangKyNhuCau {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	KHONG_DUYET = 'KHONG_DUYET',
	DA_PHAN_LOP = 'DA_PHAN_LOP',
}

export const mapTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'Không duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'Đã phân lớp',
};

export const colorTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'blue',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'orange',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'red',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'green',
};
