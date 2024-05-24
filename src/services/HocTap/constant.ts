export enum ETrinhDoKqhtHocKy {
	NAM_THU_1 = 'Năm thứ nhất',
	NAM_THU_2 = 'Năm thứ hai',
	NAM_THU_3 = 'Năm thứ ba',
	NAM_THU_4 = 'Năm thứ bốn',
	NAM_THU_5 = 'Năm thứ năm',
}

export enum ELoaiHocLuc {
	XUAT_SAC = 'Xuất sắc',
	GIOI = 'Giỏi',
	KHA = 'Khá',
	TRUNG_BINH = 'Trung bình',
	YEU = 'Yếu',
	KEM = 'Kém',
	EMPTY = 'Chưa xếp loại',
}

// Nhập điểm: Trạng thái thi
export enum ETrangThaiThi {
	CAM_THI = 'Cấm thi',
	DU_DIEU_KIEN = 'Đủ điều kiện',
}

//Xét học vụ

export enum ELoaiXuLyKQHT {
	CANH_BAO_HOC_TAP = 'CANH_BAO_HOC_TAP',
	BUOC_THOI_HOC = 'BUOC_THOI_HOC',
}

export const loaiXuLyKQHT: Record<ELoaiXuLyKQHT, string> = {
	[ELoaiXuLyKQHT.CANH_BAO_HOC_TAP]: 'Cảnh báo học tập',
	[ELoaiXuLyKQHT.BUOC_THOI_HOC]: 'Buộc thôi học',
};

export const colorLoaiXuLyKQHT: Record<ELoaiXuLyKQHT, string> = {
	[ELoaiXuLyKQHT.CANH_BAO_HOC_TAP]: 'orange',
	[ELoaiXuLyKQHT.BUOC_THOI_HOC]: 'red',
};

export enum ETrangThaiDuyetXuLyKqht {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyetXuLyKqht: Record<ETrangThaiDuyetXuLyKqht, string> = {
	[ETrangThaiDuyetXuLyKqht.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetXuLyKqht.DA_DUYET]: 'green',
	[ETrangThaiDuyetXuLyKqht.KHONG_DUYET]: 'orange',
};

export enum EYKienCoVanHocTap {
	DONG_Y = 'Đồng ý',
	KHONG_DONG_Y = 'Không đồng ý',
	CHUA_CO_Y_KIEN = 'Chưa có ý kiến',
}

export const colorYKienCoVanHocTap: Record<EYKienCoVanHocTap, string> = {
	[EYKienCoVanHocTap.DONG_Y]: 'green',
	[EYKienCoVanHocTap.CHUA_CO_Y_KIEN]: 'blue',
	[EYKienCoVanHocTap.KHONG_DONG_Y]: 'orange',
};

export enum ETrangThaiSinhVienBLTH {
	CHO_DUYET = 'Chờ duyệt',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiSinhVienBLTH: Record<ETrangThaiSinhVienBLTH, string> = {
	[ETrangThaiSinhVienBLTH.CHO_DUYET]: 'green',
	[ETrangThaiSinhVienBLTH.DA_RA_QUYET_DINH]: 'blue',
	[ETrangThaiSinhVienBLTH.KHONG_DUYET]: 'orange',
};

export enum ETrangThaiSinhVienBaoLuu {
	DANG_BAO_LUU = 'Đang bảo lưu',
	QUAY_LAI_HOC = 'Quay lại học',
	BUOC_THOI_HOC = 'Buộc thôi học',
}

export const colorTrangThaiSinhVienBaoLuu: Record<ETrangThaiSinhVienBaoLuu, string> = {
	[ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU]: 'blue',
	[ETrangThaiSinhVienBaoLuu.QUAY_LAI_HOC]: 'green',
	[ETrangThaiSinhVienBaoLuu.BUOC_THOI_HOC]: 'red',
};

// LỚP HÀNH CHÍNH
export enum EDoiTuongLopHanhChinh {
	TC = 'TC',
	LK = 'LK',
	CLC = 'CLC',
	PH = 'PH',
}

export const doiTuongLopHanhChinh: Record<EDoiTuongLopHanhChinh, string> = {
	[EDoiTuongLopHanhChinh.TC]: 'Tiêu chuẩn',
	[EDoiTuongLopHanhChinh.LK]: 'Liên kết',
	[EDoiTuongLopHanhChinh.CLC]: 'Chất lượng cao',
	[EDoiTuongLopHanhChinh.PH]: 'Phân hiệu',
};

//QUY ĐỔi ĐIỂM
export enum ETrangThaiDotQuyDoiDiem {
	CHO_XU_LY = 'Chờ xử lý',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DA_BAN_HANH = 'Đã ban hành',
}

export enum ETrangThaiPhieuQuyDoiDiem {
	CHO_XU_LY = 'Chờ xử lý',
	DA_CO_KET_QUA = 'Đã có kết quả',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
}

export const colorTrangThaiSinhVienQuyDoiDiem: Record<ETrangThaiPhieuQuyDoiDiem, string> = {
	[ETrangThaiPhieuQuyDoiDiem.CHO_XU_LY]: 'blue',
	[ETrangThaiPhieuQuyDoiDiem.DA_CO_KET_QUA]: 'orange',
	[ETrangThaiPhieuQuyDoiDiem.DA_RA_QUYET_DINH]: 'green',
};

export enum EMinhChungQuyDoiDiem {
	HOC_PHAN = 'Học phần',
	CHUNG_CHI = 'Chứng chỉ',
}

export enum ETrinhDoMinhChungQuyDoiDiem {
	CAO_DANG = 'Cao đẳng',
	DAI_HOC = 'Đại học',
}

export enum ELoaiHocPhanMinhChung {
	TRONG_CHUONG_TRINH = 'Trong chương trình',
	NGOAI_CHUONG_TRINH = 'Ngoài chương trình',
}

export const mapNameLoaiHocPhanMinhChung: Record<ELoaiHocPhanMinhChung, string> = {
	[ELoaiHocPhanMinhChung.TRONG_CHUONG_TRINH]: `Học tại ${APP_CONFIG_TEN_TRUONG.toLocaleLowerCase()}`,
	[ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH]: 'Học tại cơ sở đào tạo khác',
};

export enum ETrangThaiHocPhanQuyDoi {
	CHO_XU_LY = 'Chờ xử lý',
	CONG_NHAN = 'Công nhận',
	XIN_Y_KIEN_HOI_DONG = 'Xin ý kiến hội đồng',
	KHONG_CONG_NHAN = 'Không công nhận',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
}

export const colorTrangThaiHocPhanQuyDoi: Record<ETrangThaiHocPhanQuyDoi, string> = {
	[ETrangThaiHocPhanQuyDoi.CHO_XU_LY]: 'blue',
	[ETrangThaiHocPhanQuyDoi.CONG_NHAN]: 'orange',
	[ETrangThaiHocPhanQuyDoi.XIN_Y_KIEN_HOI_DONG]: 'purple',
	[ETrangThaiHocPhanQuyDoi.KHONG_CONG_NHAN]: 'red',
	[ETrangThaiHocPhanQuyDoi.DA_RA_QUYET_DINH]: 'green',
};
