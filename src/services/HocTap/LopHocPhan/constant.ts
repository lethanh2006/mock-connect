export enum ELoaiDauDiemHocPhan {
	HOC_PHAN_THUONG = 'hoc_phan_thuong',
	TIENG_ANH_A_B = 'tieng_anh_a_b',
	TIENG_ANH_COURSE = 'tieng_anh_course',
}

export enum ELoaiHinhHocTap {
	LY_THUYET = 'Lý thuyết',
	THUC_HANH = 'Thực hành',
	THI_NGHIEM = 'Thí nghiệm',
	DO_AN = 'Đồ án tốt nghiệp',
	BAI_TAP = 'Bài tập',
	BAI_TAP_LON = 'Bài tập lớn',
}

export enum EHinhThucGiangDay {
	TRUC_TIEP = 'Trực tiếp',
	ONLINE = 'Online',
}

export const mapHinhThucGiangDayI18n: Record<EHinhThucGiangDay, string> = {
	[EHinhThucGiangDay.TRUC_TIEP]: 'lophocphan.hinhthucgiangday.tructiep',
	[EHinhThucGiangDay.ONLINE]: 'lophocphan.hinhthucgiangday.online',
};

export const colorHinhThucGiangDay: Record<EHinhThucGiangDay, string> = {
	[EHinhThucGiangDay.TRUC_TIEP]: 'green',
	[EHinhThucGiangDay.ONLINE]: 'blue',
};

export enum ELoaiLopHocPhan {
	CHINH = 'C',
	LY_THUYET = 'LT',
	THUC_HANH = 'TH',
	THI_NGHIEM = 'TN',
	BAI_TAP = 'BT',
	BAI_TAP_LOP = 'BTL',
	DO_AN_TOT_NGHIEP = 'DATN',
}

export enum ETrangThaiLopHocPhan {
	MO = 'Mở',
	DONG = 'Đóng',
}

export const ETenLoaiLopHocPhan = {
	[ELoaiLopHocPhan.CHINH]: 'Lớp tín chỉ',
	[ELoaiLopHocPhan.LY_THUYET]: 'Lớp lý thuyết',
	[ELoaiLopHocPhan.THUC_HANH]: 'Lớp thực hành',
	[ELoaiLopHocPhan.THI_NGHIEM]: 'Lớp thí nghiệm',
	[ELoaiLopHocPhan.BAI_TAP]: 'Lớp bài tập',
	[ELoaiLopHocPhan.BAI_TAP_LOP]: 'Lớp bài tập lớn',
	[ELoaiLopHocPhan.DO_AN_TOT_NGHIEP]: 'Lớp đồ án tốt nghiệp',
};

export enum ETrangThaiDangKyGiangDay {
	CHAP_NHAN = 'Chấp nhận',
	TU_CHOI = 'Từ chối',
	DANG_XU_LY = 'Đang xử lý',
	CHUA_DANG_KY = 'Chưa đăng ký',
	DA_XU_LY_XONG = 'Đã xử lý xong',
	CHUA_CO_DANG_KY = 'Chưa có đăng ký',
}

export enum ELoaiDiemChu {
	A_PLUS = 'A+',
	A = 'A',
	A_MINUS = 'A-',
	B_PLUS = 'B+',
	B = 'B',
	B_MINUS = 'B-',
	C_PLUS = 'C+',
	C = 'C',
	C_MINUS = 'C-',
	D_PLUS = 'D+',
	D = 'D',
	D_MINUS = 'D-',
	PASS = 'P',
	T = 'T',
	CR = 'CR',
	F = 'F',
	NCR = 'NCR',
	HOAN_THI = 'I', // hoãn thi (Incomplete)
	CHUA_DU_DU_LIEU = 'X', // chưa đủ dữ liệu
	MIEN_THI = 'M', // miễn thi
	IP = 'IP', // In Progress
	MT = 'MT', // Multi-term
	NGR = 'NGR',
	W = 'W', // rút khỏi khóa học (Withdrawn)
	DAT_NGOAI_CHUONG_TRINH = 'S', // Đạt ngoài chương trình Stastifcation
	KHONG_DAT_NGOAI_CHUONG_TRINH = 'U', // Không đạt ngoài chương trình Unsatisfactory
}

export const ColorDiemChu: Record<ELoaiDiemChu, string> = {
	[ELoaiDiemChu.A_PLUS]: '#13b755',
	[ELoaiDiemChu.A]: '#13b755',
	[ELoaiDiemChu.A_MINUS]: '#13b755',
	[ELoaiDiemChu.B_PLUS]: '#33adff',
	[ELoaiDiemChu.B]: '#33adff',
	[ELoaiDiemChu.B_MINUS]: '#33adff',
	[ELoaiDiemChu.C_PLUS]: '#ffab50',
	[ELoaiDiemChu.C]: '#ffab50',
	[ELoaiDiemChu.C_MINUS]: '#ffab50',
	[ELoaiDiemChu.D_PLUS]: '#ff7171',
	[ELoaiDiemChu.D]: '#ff7171',
	[ELoaiDiemChu.D_MINUS]: '#ff7171',
	[ELoaiDiemChu.F]: '#a90b00',
	[ELoaiDiemChu.NCR]: '#a90b00',
	[ELoaiDiemChu.PASS]: '#13b755',
	[ELoaiDiemChu.T]: '#13b755',
	[ELoaiDiemChu.CR]: '#13b755',
	[ELoaiDiemChu.HOAN_THI]: 'rgb(173 173 173)',
	[ELoaiDiemChu.CHUA_DU_DU_LIEU]: 'rgb(173 173 173)',
	[ELoaiDiemChu.MIEN_THI]: '#13b755',
	[ELoaiDiemChu.IP]: 'rgb(173 173 173)',
	[ELoaiDiemChu.MT]: '#13b755',
	[ELoaiDiemChu.NGR]: 'rgb(173 173 173)',
	[ELoaiDiemChu.W]: 'rgb(173 173 173)',
	[ELoaiDiemChu.DAT_NGOAI_CHUONG_TRINH]: '#13b755',
	[ELoaiDiemChu.KHONG_DAT_NGOAI_CHUONG_TRINH]: '#a90b00',
};

//LMS
export enum EModeLms {
	MOODLE = 'moodle',
	ODOO = 'odoo',
	NONE = 'none',
}
