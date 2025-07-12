import { ETagColor } from '../base/constant';

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

export const colorTrangThaiHocTap: Record<ETrangThaiHocTap, ETagColor> = {
	[ETrangThaiHocTap.CHUA_HOC]: ETagColor.DEFAULT,
	[ETrangThaiHocTap.DANG_HOC]: ETagColor.BLUE,
	[ETrangThaiHocTap.DA_HOC]: ETagColor.GREEN,
	[ETrangThaiHocTap.CHUA_DAT]: ETagColor.RED,
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

// CHƯƠNG TRÌNH ĐÀO TẠO
export enum ELoaiChuongTrinhDaoTao {
	CHUAN = 'Chuan',
	KE_HOACH = 'KeHoach',
}

export const LoaiChuongTrinhDaoTao: Record<ELoaiChuongTrinhDaoTao, string> = {
	[ELoaiChuongTrinhDaoTao.CHUAN]: 'Chuẩn',
	[ELoaiChuongTrinhDaoTao.KE_HOACH]: 'Kế hoạch',
};

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
