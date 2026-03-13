export enum ELoaiThanhVien {
	TRONG_HE_THONG = 'Cán bộ / Giảng viên trong Học viện',
	NGOAI_HE_THONG = 'Người ngoài Học viện',
}

export enum ETrangThaiSanPham {
	DANG_THUC_HIEN = 'Đang thực hiện',
	CHUA_TIEP_NHAN = 'Chưa có kết quả tiếp nhận',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	CHINH_SUA_LAI = 'Chỉnh sửa lại',
	DA_CHINH_SUA_LAI = 'Đã chỉnh sửa lại',
}

export const MapKeyColorTrangThaiSanPham = {
	[ETrangThaiSanPham.DANG_THUC_HIEN]: 'gray',
	[ETrangThaiSanPham.CHINH_SUA_LAI]: '#ffca2c',
	[ETrangThaiSanPham.CHUA_TIEP_NHAN]: '#0d6efd',
	[ETrangThaiSanPham.DUYET]: '#1fba36',
	[ETrangThaiSanPham.DA_CHINH_SUA_LAI]: '#0dcaf0',
	[ETrangThaiSanPham.KHONG_DUYET]: '#dc3545',
};

export const MapKeyTextTrangThaiSanPham = {
	[ETrangThaiSanPham.DANG_THUC_HIEN]: 'Đang thực hiện',
	[ETrangThaiSanPham.CHUA_TIEP_NHAN]: 'Chờ xử lý',
	[ETrangThaiSanPham.DUYET]: 'Duyệt',
	[ETrangThaiSanPham.KHONG_DUYET]: 'Không duyệt',
	[ETrangThaiSanPham.CHINH_SUA_LAI]: 'Chỉnh sửa lại',
	[ETrangThaiSanPham.DA_CHINH_SUA_LAI]: 'Đã chỉnh sửa lại',
};

export enum ETrangThaiYeuCauQuyDoiGio {
	CHUA_TIEP_NHAN = 'Chưa có kết quả tiếp nhận',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	CHINH_SUA_LAI = 'Chỉnh sửa lại',
	DA_CHINH_SUA_LAI = 'Đã chỉnh sửa lại',
}

export const MapKeyColorTrangThaiYeuCauQuyDoiGio = {
	[ETrangThaiYeuCauQuyDoiGio.CHINH_SUA_LAI]: '#ffca2c',
	[ETrangThaiYeuCauQuyDoiGio.CHUA_TIEP_NHAN]: '#0d6efd',
	[ETrangThaiYeuCauQuyDoiGio.DUYET]: '#1fba36',
	[ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI]: '#0dcaf0',
	[ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET]: '#dc3545',
};

export const MapKeyTextTrangThaiYeuCauQuyDoiGio = {
	[ETrangThaiYeuCauQuyDoiGio.CHUA_TIEP_NHAN]: 'Chờ xử lý',
	[ETrangThaiYeuCauQuyDoiGio.DUYET]: 'Duyệt',
	[ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET]: 'Không duyệt',
	[ETrangThaiYeuCauQuyDoiGio.CHINH_SUA_LAI]: 'Chỉnh sửa lại',
	[ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI]: 'Đã chỉnh sửa lại',
};

export enum ELoaiKhaiBao {
	TU_KHAI_BAO = 'Tự khai báo',
	DUOC_KHAI_BAO = 'Được khai báo',
}

export enum EKieuDuLieuSanPham {
	CUA_TOI = 'Dữ liệu của tôi',
	TOAN_HOC_VIEN = 'Dữ liệu toàn Học viện',
}

export enum ELoaiDuLieuQuyDoiGio {
	CAN_BO_DE_XUAT = 'Cán bộ/giảng viên khai báo giờ chuẩn NCKH',
	HE_THONG_DE_XUAT = 'Dữ liệu do Hệ thống đề xuất',
	// PHONG_QLKH_DA_DUYET = 'Dữ liệu do Phòng QLKH đã duyệt lần gần nhất',
}

export const MapKeyLoaiDuLieuQuyDoiGio = {
	[ELoaiDuLieuQuyDoiGio.CAN_BO_DE_XUAT]: 'Cán bộ/giảng viên khai báo giờ chuẩn NCKH',
	[ELoaiDuLieuQuyDoiGio.HE_THONG_DE_XUAT]: 'Dữ liệu do Hệ thống đề xuất',
	// [ELoaiDuLieuQuyDoiGio.PHONG_QLKH_DA_DUYET]: 'Dữ liệu do Phòng QLKH đã duyệt lần gần nhất',
};

export const MapKeyLoaiDuLieuQuyDoiDiem = {
	[ELoaiDuLieuQuyDoiGio.CAN_BO_DE_XUAT]: 'Cán bộ/giảng viên khai báo điểm chuẩn NCKH',
	[ELoaiDuLieuQuyDoiGio.HE_THONG_DE_XUAT]: 'Dữ liệu do Hệ thống đề xuất',
	// [ELoaiDuLieuQuyDoiGio.PHONG_QLKH_DA_DUYET]: 'Dữ liệu do Phòng QLKH đã duyệt lần gần nhất',
};

export enum EStepSanPhamHoatDong {
	THONG_TIN_CHUNG = 'Thông tin chung',
	GIO = 'Giờ chuẩn nghiên cứu khoa học',
	DIEM = 'Điểm công trình khoa học',
}

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
export const ShortNameHocHam: any = {
	[EHocHam.GS]: 'GS.',
	[EHocHam.PGS]: 'PGS.',
};

export const ShortNameHocVi: any = {
	[EHocVi.THS]: 'ThS.',
	[EHocVi.TS]: 'TS.',
	[EHocVi.KS]: 'KS.',
	[EHocVi.CN]: 'CN.',
	[EHocVi.GVC]: 'GVC.',
};

export enum EVaiTroThanhVienNckh {
	CBGV = 'CBGV',
	SINH_VIEN = 'SINH_VIEN',
	KHAC = 'KHAC',
}

export const MapNameVaiTroThanhVienNCKH: any = {
	[EVaiTroThanhVienNckh.CBGV]: 'Cán bộ / Giảng viên trong Học viện',
	[EVaiTroThanhVienNckh.SINH_VIEN]: 'Sinh viên trong Học viện',
	[EVaiTroThanhVienNckh.KHAC]: 'Người ngoài Học viện',
};
