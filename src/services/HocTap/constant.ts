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
export enum ETrangThaiDuyetCanhBao {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyetCanhBao: Record<ETrangThaiDuyetCanhBao, string> = {
	[ETrangThaiDuyetCanhBao.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetCanhBao.DA_DUYET]: 'green',
	[ETrangThaiDuyetCanhBao.KHONG_DUYET]: 'orange',
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

export enum ETrangThaiSinhVienQuyDoiDiem {
	CHO_XU_LY = 'Chờ xử lý',
	DA_RA_QUYET_DINH = 'Đã ra quyết định',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiSinhVienQuyDoiDiem: Record<ETrangThaiSinhVienQuyDoiDiem, string> = {
	[ETrangThaiSinhVienQuyDoiDiem.CHO_XU_LY]: 'blue',
	[ETrangThaiSinhVienQuyDoiDiem.DA_RA_QUYET_DINH]: 'green',
	[ETrangThaiSinhVienQuyDoiDiem.KHONG_DUYET]: 'orange',
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
	NGOAI_CHUONG_TRINH = 'Ngoài chương trình',
	TRONG_CHUONG_TRINH = 'Trong chương trình',
}
