// ĐỢT CHẤM ĐIỂM RÈN LUYỆN
export enum EHeDaoTaoRenLuyen {
	CHINH_QUY = 'Hệ chính quy',
}

// Loại họp lớp/sinh hoạt
export enum ELoaiHopLopSinhHoat {
	DAU_KY = 'Đầu kỳ học',
	GIUA_KY = 'Giữa kỳ học',
	CUOI_KY = 'Cuối kỳ học',
}

export enum ETrangThaiChamDiem {
	CHUA_CHAM = 'Chưa chấm',
	LUU = 'Lưu',
	DA_NOP = 'Đã nộp',
}

export const trangThaiPhieuDiem = [
	'CVHT đã nộp',
	'CVHT đã đánh giá',
	'Chờ CVHT đánh giá',
	'Lớp đã đánh giá - Chưa gửi',
	'Chờ lớp đánh giá',
	'Đã đánh giá - Chưa gửi',
	'Chưa đánh giá',
];

export const colorTagTrangThaiPhieuDiem = ['green', 'lime', 'magenta', 'purple', 'cyan', 'blue', 'gold'];

export enum EReceiverType {
	// Topic = 'Topic',
	User = 'User',
	All = 'All',
	KhoaSinhVien = 'KhoaSinhVien',
	Khoa = 'Khoa',
	Nganh = 'Nganh',
	LopHanhChinh = 'LopHanhChinh',
	LopHocPhan = 'LopHocPhan',
}

export const LoaiDoiTuongThamGia: Partial<Record<EReceiverType, string>> = {
	[EReceiverType.User]: 'Người dùng cụ thể',
	[EReceiverType.All]: 'Toàn Học viện',
	[EReceiverType.Khoa]: 'Khoa',
	[EReceiverType.KhoaSinhVien]: 'Khóa sinh viên',
	[EReceiverType.Nganh]: 'Ngành đào tạo',
	[EReceiverType.LopHanhChinh]: 'Lớp hành chính',
	[EReceiverType.LopHocPhan]: 'Lớp học phần',
};
