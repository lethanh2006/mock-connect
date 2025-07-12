import { type TagProps } from 'antd';
import { type SuKien } from './typings';

export enum ETrangThaiThamGiaSuKien {
	THAM_DU_THANH_CONG = 'Tham dự sự kiện thành công.',
	THAM_DU_THAT_BAI = 'Tham dự sự kiện thất bại.',
	DA_THAM_DU = 'Bạn đã đã đăng ký tham gia sự kiện này trước đó.',
}

export enum ETrangThaiDienRa {
	CHUA_DIEN_RA = 'Chưa diễn ra',
	DA_DIEN_RA = 'Đã diễn ra',
	DANG_DIEN_RA = 'Đang diễn ra',
}

export const ETrangThaiDienRaMappingToTagColor: Record<ETrangThaiDienRa, TagProps['color']> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'orange',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'blue',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'green',
};

export const ETrangThaiDienRaMappingToHexColor: Record<ETrangThaiDienRa, string> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: '#d46b08',
	[ETrangThaiDienRa.DANG_DIEN_RA]: '#096dd9',
	[ETrangThaiDienRa.DA_DIEN_RA]: '#389e0d',
};

export const ETrangThaiDienRaMappingToThongKeKey: Record<ETrangThaiDienRa, keyof SuKien.ThongKeTheoNam> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'suKienChuaDienRa',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'suKienDangDienRa',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'suKienDaDienRa',
};

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

export enum ESuKienRole {
	HOC_VIEN = 'sinh_vien',
	CAN_BO = 'nhan_vien',
}

export enum ELoaiSuKien {
	LICH_HOC = 'Lịch học',
	LICH_THI = 'Lịch thi',
	CA_NHAN = 'Cá nhân',
	CHUNG = 'Chung',
	CAC_HOAT_DONG = 'Các hoạt động cho sinh viên',
	DAO_TAO_BOI_DUONG = 'Đào tạo bồi dưỡng',
	HOP_TAC_NGUYEN_CUU_CHUYEN_GAO = 'Hợp tác - Nghiên cứu - chuyển giao',
	THUC_THI_CHINH_SACH = 'Thực thi, phát triển chính sách',
	HOAT_DONG_XA_HOI = 'Hoạt động xã hội',
	KHAC = 'Khác',
	BAI_TAP = 'Bài tập',
	HOP_LOP = 'Họp lớp',
}

export enum ELoaiSuKienSinhVien {
	TUAN_LE_CONG_DAN = 'Tuần lễ công dân',
	HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI = 'Hoạt động huy động giáo dục tư tưởng chính trị các cấp',
	NGAY_HOI_VIEC_LAM = 'Ngày hội việc làm',
	HOI_THAO_CHUYEN_DE_VIEC_LAM = 'Hội thảo, nói chuyện chuyên đề về việc làm, đào tạo kỹ năng mềm',
	KHAC = 'Khác',
}

export const locationPathMappingToESuKienType: Partial<Record<string, ELoaiSuKien>> = {
	'cac-hoat-dong-cho-sinh-vien': ELoaiSuKien.CAC_HOAT_DONG,
	'dao-tao-boi-duong': ELoaiSuKien.DAO_TAO_BOI_DUONG,
	'hop-tac-nghien-cuu-chuyen-giao': ELoaiSuKien.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO,
	'thuc-thi-chinh-sach': ELoaiSuKien.THUC_THI_CHINH_SACH,
	'hoat-dong-xa-hoi': ELoaiSuKien.HOAT_DONG_XA_HOI,
	khac: ELoaiSuKien.KHAC,
};

export const ColorSuKien: Partial<Record<ELoaiSuKien, string>> = {
	[ELoaiSuKien.LICH_HOC]: '#31becbb3',
	[ELoaiSuKien.LICH_THI]: '#df4471b3',
	[ELoaiSuKien.CA_NHAN]: '#57bf56b3',
	[ELoaiSuKien.CHUNG]: '#2098c7b3',
	[ELoaiSuKien.CAC_HOAT_DONG]: '#2098c7b3',
	[ELoaiSuKien.BAI_TAP]: '#f1a32ab3',
	[ELoaiSuKien.HOP_LOP]: '#9f44efb3',
};

export const THU_TRONG_TUAN = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

// Hoạt động công tác sinh viên
export enum EHoatDongChungType1 {
	GIAO_DUC_CHINH_TRI_TU_TUONG = 'Giáo dục chính trị tư tưởng',
	PHUC_VU_CONG_DONG = 'Phục vụ cộng đồng',
	VAN_HOA_THE_THAO = 'Văn hóa, thể thao',
}

export enum ETrangThaiThamGia {
	XAC_NHAN = 'Xác nhận',
	CHUA_XAC_NHAN = 'Chưa xác nhận',
	TU_CHOI = 'Từ chối',
}

export const MapColorETrangThaiThamGia = {
	[ETrangThaiThamGia.XAC_NHAN]: 'green',
	[ETrangThaiThamGia.CHUA_XAC_NHAN]: 'orange',
	[ETrangThaiThamGia.TU_CHOI]: 'red',
};

export enum ELoaiQR {
	THAM_GIA = 'Tham gia',
	DANG_KY = 'Đăng ký',
}

export const MapTitleELoaiQR = {
	[ELoaiQR.DANG_KY]: 'Đã đăng ký',
	[ELoaiQR.THAM_GIA]: 'Đã tham gia',
};
