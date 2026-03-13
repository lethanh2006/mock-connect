export const TU_DANH_GIA_PREFIX = 'tuDanhGia_';
export const CVHT_DANH_GIA_PREFIX = 'cvhtDanhGia_';
export const CTSV_DANH_GIA_PREFIX = 'ctsvDanhGia_';
export const KHOA_DANH_GIA_PREFIX = 'khoaDanhGia_';
export const BCS_DANH_GIA_PREFIX = 'bcsDanhGia_';
export const GHI_CHU_PREFIX = 'ghiChu_';

export enum ENguoiTraLoi {
	CA_NHAN = 'Cá nhân',
	LANH_DAO_PHONG_BAN = 'Lãnh đạo phòng ban',
	KHAC = 'Khác',
}

export enum ELoaiCauHoiDrl {
	NumberInputRating = 'Numberinputrating',
	//diem ren luyen
	MINH_CHUNG = 'diemMinhChung',
	HE_THONG = 'diemHeThong',
}

export enum ENguoiTraLoiDrl {
	SINH_VIEN = 'Sinh viên',
	CO_VAN_HOC_TAP = 'Cố vấn học tập',
	CTSV = 'Phòng công tác sinh viên',
	KHOA = 'Khoa sinh viên',
	BCS = 'Ban cán sự',
}

export enum ETrangThaiPhieuDiemRL {
	CHUA_GUI = 'Chưa gửi',
	LUU = 'Lưu',
	DA_GUI = 'Đã gửi',
}

export const MapTitleETrangThaiPhieuDiemRL: any = {
	[ETrangThaiPhieuDiemRL.CHUA_GUI]: 'Chưa gửi',
	[ETrangThaiPhieuDiemRL.LUU]: 'Đã lưu phiếu điểm, chưa gửi',
	[ETrangThaiPhieuDiemRL.DA_GUI]: 'Đã gửi',
};

export const MapColorETrangThaiPhieuDiemRL = {
	[ETrangThaiPhieuDiemRL.CHUA_GUI]: '#1890ff',
	[ETrangThaiPhieuDiemRL.LUU]: '#ffc107',
	[ETrangThaiPhieuDiemRL.DA_GUI]: '#28a745',
};

export enum EPhanLoaiTrongFormDanhGia {
	XUAT_SAC = 'Xuất sắc',
	TOT_A = 'Tốt A',
	TOT_B = 'Tốt B',
	HOAN_THANH = 'Hoàn thành',
	KHONG_HOAN_THANH = 'Không hoàn thành',
}

export const PhanLoaiTrongFormDanhGiaMappingtoLabel: Record<EPhanLoaiTrongFormDanhGia, string> = {
	[EPhanLoaiTrongFormDanhGia.XUAT_SAC]: 'Hoàn thành xuất sắc nhiệm vụ (loại A+, từ 90 - 100 điểm)',
	[EPhanLoaiTrongFormDanhGia.TOT_A]: 'Hoàn thành tốt nhiệm vụ (loại A, từ 80 - dưới 90 điểm)',
	[EPhanLoaiTrongFormDanhGia.TOT_B]: 'Hoàn thành tốt nhiệm vụ (loại B, từ 70 - dưới 80 điểm)',
	[EPhanLoaiTrongFormDanhGia.HOAN_THANH]: 'Hoàn thành nhiệm vụ (loại C, từ 50 - dưới 70 điểm)',
	[EPhanLoaiTrongFormDanhGia.KHONG_HOAN_THANH]: 'Không hoàn thành nhiệm vụ (loại D, dưới 50 điểm)',
};

export enum ETrangThaiDanhGia {
	CHUA_DANH_GIA = 'Chưa đánh giá',
	DA_DANH_GIA_CHUA_GUI = 'Đã đánh giá - Chưa gửi',
	CHO_DANH_GIA = 'Chờ đánh giá',
	DON_VI_DANH_GIA_CHUA_GUI = 'Đơn vị đánh giá - Chưa gửi',
	DON_VI_DANH_GIA_DA_GUI = 'Đơn vị đánh giá - Đã gửi',
	HOI_DONG_DA_DUYET = 'Hội đồng đã duyệt',
	DA_GUI = 'Đã gửi',
	CHUA_GUI = 'Chưa gửi',
	CHUA_DK_DG = 'Chưa đủ điều kiện đánh giá',
}

export enum EXepLoaiDiemRenLuyen {
	XUAT_SAC = 'XUAT_SAC',
	TOT = 'TOT',
	KHA = 'KHA',
	TRUNG_BINH = 'TRUNG_BINH',
	YEU = 'YEU',
	KEM = 'KEM',
	CHUA_XEP_LOAI = 'CHUA_XEP_LOAI',
}

export enum EXepLoaiDiemRenLuyenLabel {
	XUAT_SAC = 'Xuất sắc',
	TOT = 'Tốt',
	KHA = 'Khá',
	TRUNG_BINH = 'Trung bình',
	YEU = 'Yếu',
	KEM = 'Kém',
	// CHUA_XEP_LOAI = '',
}

export const MapKeyColorXepLoaiDiemRenLuyenLabel = {
	[EXepLoaiDiemRenLuyenLabel.TOT]: '#007bff',
	[EXepLoaiDiemRenLuyenLabel.XUAT_SAC]: '#28a745',
	[EXepLoaiDiemRenLuyenLabel.KHA]: '#34e8eb',
	[EXepLoaiDiemRenLuyenLabel.TRUNG_BINH]: '#ebe534',
	[EXepLoaiDiemRenLuyenLabel.YEU]: '#eb8934',
	[EXepLoaiDiemRenLuyenLabel.KEM]: '#dc3545',
	// [EXepLoaiDiemRenLuyenLabel.CHUA_XEP_LOAI]: '#838f8f',
};

export enum ETrangThaiKhieuNai {
	DA_DUYET = 'Đã duyệt',
	CHO_XU_LY = 'Chờ xử lý',
	KHONG_DUYET = 'Không duyệt',
}

export const MapKeyColorTrangThaiKhieuNai = {
	[ETrangThaiKhieuNai.DA_DUYET]: '#28a745',
	[ETrangThaiKhieuNai.CHO_XU_LY]: '#007bff',
	[ETrangThaiKhieuNai.KHONG_DUYET]: '#dc3545',
};
