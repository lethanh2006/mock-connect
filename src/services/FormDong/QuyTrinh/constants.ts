export enum PhuongThucPhanCong {
	TO_CHUC = 'Tổ chức nhân sự - Đơn vị',
	NGUOI_CU_THE = 'Người cụ thể',
}
export enum DoiTuong {
	TAT_CA = 'Tất cả',
	SINH_VIEN = 'Quản lý đào tạo - Sinh viên',
	CAN_BO = 'Quản lý nhân sự - Cán bộ',
}
export const MapKeyDoiTuong = {
	[DoiTuong.TAT_CA]: 'Tất cả',
	[DoiTuong.SINH_VIEN]: 'Sinh viên',
	[DoiTuong.CAN_BO]: 'Giảng viên',
};
export enum DoiTuongDieuPhoi {
	NGUOI_CU_THE = 'Người dùng',
	TO_CHUC = 'Bộ phận xử lý',
}
export const MapKeyPhuongThucPhanCong = {
	[PhuongThucPhanCong.TO_CHUC]: 'Đơn vị cụ thể',
	[PhuongThucPhanCong.NGUOI_CU_THE]: 'Nhóm người dùng',
};
export enum EHocHam {
	GS = 'Giáo sư',
	PGS = 'Phó Giáo sư',
}

export enum EHocVi {
	CN = 'Cử nhân',
	KS = 'Kỹ sư',
	THS = 'Thạc sỹ',
	TS = 'Tiến sỹ',
	GVC = 'Giảng viên chính',
}

export enum ELoaiTinhTrangDon {
	CAN_XU_LY = 'Cần xử lý',
	TAT_CA = 'Tất cả',
	CHUA_TRA_KET_QUA = 'Chưa trả kết quả',
	DA_TRA_KET_QUA = 'Đã trả kết quả',
}
export enum ELoaiBodyCallBack {
	DON = 'Đơn',
	KHAI_BAO = 'Bước - Khai báo',
	KET_QUA_TIEP_NHAN = 'Bước - Kết quả tiếp nhận',
}
export enum LoaiDefaultValue {
	QLDT_SV_HO_TEN = 'QLDT - Họ tên sinh viên',
	QLDT_SV_HO_DEM = 'QLDT - Họ đệm sinh viên',
	QLDT_SV_TEN = 'QLDT - Tên sinh viên',
	QLDT_SV_MA_SINH_VIEN = 'QLDT - Mã sinh viên',
	QLDT_SV_NGAY_SINH = 'QLDT - Ngày sinh sinh viên',
	QLDT_SV_LOP_HC = 'QLDT - Lớp hành chính sinh viên',
	QLDT_SV_KHOA = 'QLDT - Khóa sinh viên',
	QLDT_SV_NGANH = 'QLDT - Ngành sinh viên',
	QLDT_SV_CHUYEN_NGANH = 'QLDT - Chuyên ngành sinh viên',
	QLDT_SV_DON_VI = 'QLDT - Đơn vị sinh viên',
	QLDT_SV_TRINH_DO = 'QLDT - Trình độ đào tạo sinh viên',
	QLDT_SV_HINH_THUC = 'QLDT - Hình thức đào tạo sinh viên',
	QLDT_SV_SO_DT = 'QLDT - Số điện thoại sinh viên',
	QLDT_SV_GIOI_TINH = 'QLDT - Giới tính sinh viên',
	TCNS_HO_TEN = 'TCNS - Họ tên',
	TCNS_HO_DEM = 'TCNS - Họ đệm',
	TCNS_TEN = 'TCNS - Tên',
	TCNS_GIOI_TINH = 'TCNS - Giới tính',
	TCNS_MA_CAN_BO = 'TCNS - Mã cán bộ',
	TCNS_NGAY_SINH = 'TCNS - Ngày sinh',
	TNCS_DON_VI = 'TCNS - Đơn vị chính',
	TCNS_SO_DIEN_THOAI = 'TCNS - Số điện thoại',
	TCNS_HOC_HAM = 'TCNS - Học hàm',
	TCNS_HOC_VI = 'TCNS - Học vị',
	TCNS_TRINH_DO_DAO_TAO = 'TCNS - Trình độ đào tạo',
	THONG_KE_DON_QUY_TRINH = 'Thống kê - Đơn quy trình',
	MAP_DANH_MUC = 'Map danh mục',
	LAY_TU_KHAI_BAO = 'Lấy từ khai báo',
	CUSTOM = 'Tùy biến',
}

export enum EDoiTuongPhamViQuyTrinh {
	TAT_CA = 'TAT_CA',
	DON_VI = 'DON_VI',
	KHOA_SV = 'KHOA_SV',
	NGANH = 'NGANH',
	LOP_HANH_CHINH = 'LOP_HANH_CHINH',
	LOP_HOC_PHAN = 'LOP_HOC_PHAN',
}

export const MapKeyEReceiverType = {
	// Topic = 'Topic',
	// User = 'User',
	[EDoiTuongPhamViQuyTrinh.TAT_CA]: 'All',
	[EDoiTuongPhamViQuyTrinh.KHOA_SV]: 'KhoaSinhVien',
	[EDoiTuongPhamViQuyTrinh.DON_VI]: 'Khoa',
	[EDoiTuongPhamViQuyTrinh.NGANH]: 'Nganh',
	[EDoiTuongPhamViQuyTrinh.LOP_HANH_CHINH]: 'LopHanhChinh',
	[EDoiTuongPhamViQuyTrinh.LOP_HOC_PHAN]: 'LopHocPhan',
};

export const MapKeyDoiTuongPhamViQuyTrinh: any = {
	[EDoiTuongPhamViQuyTrinh.DON_VI]: 'Đơn vị',
	[EDoiTuongPhamViQuyTrinh.KHOA_SV]: 'Khóa sinh viên',
	[EDoiTuongPhamViQuyTrinh.LOP_HANH_CHINH]: 'Lớp hành chính',
	[EDoiTuongPhamViQuyTrinh.LOP_HOC_PHAN]: 'Lớp học phần',
	[EDoiTuongPhamViQuyTrinh.NGANH]: 'Ngành đào tạo',
	[EDoiTuongPhamViQuyTrinh.TAT_CA]: 'Toàn trường',
};

export enum EVaiTroPhamViQuyTrinh {
	SINH_VIEN = 'SINH_VIEN',
	CBGV = 'CBGV',
}

export const MapKeyVaiTroPhamViQuyTrinh: any = {
	[EVaiTroPhamViQuyTrinh.CBGV]: 'Cán bộ, giảng viên',
	[EVaiTroPhamViQuyTrinh.SINH_VIEN]: 'Sinh viên',
};
export enum EPhanHe {
	KHAO_THI = 'KHAO_THI',
	VWA_CONNECT = 'VWA_CONNECT',
	CONG_CAN_BO = 'CONG_CAN_BO',
	CONG_TAC_SINH_VIEN = 'CONG_TAC_SINH_VIEN',
	VAN_PHONG_DIEU_HANH = 'VAN_PHONG_DIEU_HANH',
	QUAN_LY_KHOA_HOC = 'QUAN_LY_KHOA_HOC',
	TCNS = 'TCNS',
	QLDT = 'QLDT',
	TAI_CHINH = 'TAI_CHINH',
}
export const MapKeyPhanHe: any = {
	[EPhanHe.KHAO_THI]: 'Khảo thí',
	[EPhanHe.VWA_CONNECT]: 'Cổng học viên',
	[EPhanHe.CONG_CAN_BO]: 'Cổng cán bộ',
	[EPhanHe.CONG_TAC_SINH_VIEN]: 'Công tác sinh viên',
	[EPhanHe.VAN_PHONG_DIEU_HANH]: 'Văn phòng điều hành',
	[EPhanHe.QUAN_LY_KHOA_HOC]: 'Quản lý khoa học',
	[EPhanHe.TCNS]: 'Tổ chức nhân sự',
	[EPhanHe.QLDT]: 'Quản lý đào tạo',
	[EPhanHe.TAI_CHINH]: 'Tài chính',
};
export enum ENguonDot {
	TU_TAO = 'Tự tạo',
	PHAN_HE = 'Lấy từ phân hệ',
	KHONG_CO_DOT = 'Không có đợt',
}

export enum ELoaiThoiHanXuLy {
	NGAY_TRONG_TUAN = 'Ngày trong tuần',
	SO_NGAY_CU_THE = 'Số ngày cụ thể',
}

export enum ENgayTrongTuan {
	THU_HAI = 'Thứ hai',
	THU_BA = 'Thứ ba',
	THU_TU = 'Thứ tư',
	THU_NAM = 'Thứ năm',
	THU_SAU = 'Thứ sáu',
	THU_BAY = 'Thứ bảy',
	CHU_NHAT = 'Chủ nhật',
}
