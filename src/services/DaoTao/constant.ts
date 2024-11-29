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
	BAO_LUU = 'Bảo lưu',
	DA_TOT_NGHIEP = 'Đã tốt nghiệp',
	THOI_HOC = 'Thôi học',
	BUOC_THOI_HOC = 'Buộc thôi học',
	CHUYEN_TRUONG = 'Chuyển trường',
}

export const colorTrangThaiHocSv: Record<ETrangThaiHocSv, string> = {
	[ETrangThaiHocSv.CHUA_PHAN_LOP]: 'geekblue',
	[ETrangThaiHocSv.DANG_HOC]: 'blue',
	[ETrangThaiHocSv.BAO_LUU]: 'orange',
	[ETrangThaiHocSv.DA_TOT_NGHIEP]: 'green',
	[ETrangThaiHocSv.THOI_HOC]: 'red',
	[ETrangThaiHocSv.BUOC_THOI_HOC]: 'purple',
	[ETrangThaiHocSv.CHUYEN_TRUONG]: 'volcano',
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
