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

// Điểm danh lớp

export enum ETrangThaiLopDiemDanh {
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
	DA_DIEM_DANH = 'DA_DIEM_DANH',
}

export const trangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'Đã điểm danh',
};

export const colorTrangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'red',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'green',
};

// Trạng thái điểm danh sinh viên

export enum ETrangThaiUserDiemDanh {
	CO_MAT = 'CO_MAT',
	MUON_VE_SOM = 'MUON_VE_SOM',
	VANG_CO_PHEP = 'VANG_CO_PHEP',
	VANG_KHONG_PHEP = 'VANG_KHONG_PHEP',
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
}

export const trangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'Có mặt',
	[ETrangThaiUserDiemDanh.MUON_VE_SOM]: 'Muộn/Về sớm',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'Vắng có phép',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'Vắng không phép',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
};

export const colorTrangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'green',
	[ETrangThaiUserDiemDanh.MUON_VE_SOM]: 'blue',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'gold',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'orange',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'red',
};

//Đăng ký nhu cầu
export enum ETrangThaiHocPhanDangKyNhuCau {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
}

export const mapTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'Đã duyệt',
};

export const colorTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'blue',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'green',
};
