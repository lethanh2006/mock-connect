export enum ETrangThaiKeHoachDeTai {
	CHUA_DIEN_RA = 'Chưa diễn ra',
	DA_DIEN_RA = 'Đã diễn ra',
	DANG_DIEN_RA = 'Đang diễn ra ',
}

export enum ELoaiDeTai {
	SINH_VIEN_KHOA = 'SINH_VIEN_KHOA',
	SINH_VIEN_HOC_VIEN = 'SINH_VIEN_HOC_VIEN',
	GIANG_VIEN = 'GIANG_VIEN',
}

export const MapKeyNameLoaiDeTai = {
	[ELoaiDeTai.GIANG_VIEN]: 'Đề tài NCKH của giảng viên, nghiên cứu viên, người lao động',
	[ELoaiDeTai.SINH_VIEN_HOC_VIEN]: 'Đề tài NCKH sinh viên cấp Học viện',
	[ELoaiDeTai.SINH_VIEN_KHOA]: 'Đề tài NCKH sinh viên cấp khoa/viện',
};

export enum EMocThoiGianDot {
	// thoiGian = 'thoiGian',
	thoiGianDangKy = 'thoiGianDangKy',
	thoiGianXetDuyetDangKy = 'thoiGianXetDuyetDangKy',
	thoiGianThuyetMinh = 'thoiGianThuyetMinh',
	thoiGianXetDuyetThuyetMinh = 'thoiGianXetDuyetThuyetMinh',
	// thoiGianNghiemThu = 'thoiGianNghiemThu',
}

export const MapKeyNameMocThoiGianDot = {
	// [EMocThoiGianDot.thoiGian]: 'Thời gian bắt đầu - kết thúc đợt',
	[EMocThoiGianDot.thoiGianDangKy]: 'Thời gian bắt đầu - kết thúc đăng ký đề xuất',
	[EMocThoiGianDot.thoiGianXetDuyetDangKy]: 'Thời gian bắt đầu - kết thúc xét duyệt đăng ký đề xuất',
	[EMocThoiGianDot.thoiGianThuyetMinh]: 'Thời gian bắt đầu - kết thúc nộp thuyết minh',
	[EMocThoiGianDot.thoiGianXetDuyetThuyetMinh]: 'Thời gian bắt đầu - kết thúc xét duyệt thuyết minh',
	// [EMocThoiGianDot.thoiGianNghiemThu]: 'Thời gian bắt đầu - kết thúc nghiệm thu',
};

export const MapKeyFieldMocThoiGianDot = {
	// [EMocThoiGianDot.thoiGian]: ['ngayBatDau', 'ngayKetThuc'],
	[EMocThoiGianDot.thoiGianDangKy]: ['ngayBatDauDangKy', 'ngayKetThucDangKy'],
	[EMocThoiGianDot.thoiGianXetDuyetDangKy]: ['ngayBatDauXetDuyet', 'ngayKetThucXetDuyet'],
	[EMocThoiGianDot.thoiGianThuyetMinh]: ['ngayBatDauDeCuong', 'ngayKetThucDeCuong'],
	[EMocThoiGianDot.thoiGianXetDuyetThuyetMinh]: ['ngayBatDauXetDuyetDeCuong', 'ngayKetThucXetDuyetDeCuong'],
	// [EMocThoiGianDot.thoiGianNghiemThu]: ['ngayBatDauNghiemThu', 'ngayKetThucNghiemThu'],
};

export enum EVanBanDot {
	mauSinhVienKhoa = 'mauSinhVienKhoa',
	mauSinhVienHocVien = 'mauSinhVienHocVien',
	mauGiangVien = 'mauGiangVien',
}

export const MapKeyNameVanBanDot = {
	[EVanBanDot.mauSinhVienKhoa]: 'Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp khoa',
	[EVanBanDot.mauSinhVienHocVien]: 'Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp HV',
	[EVanBanDot.mauGiangVien]: 'Mẫu phiếu đăng ký đề xuất đề tài cán bộ giảng viên',
};
