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

export enum ESuKienType {
	CA_NHAN = 'Cá nhân',
	TAT_CA = 'Chung',
	CAC_HOAT_DONG = 'Các hoạt động cho sinh viên',
	DAO_TAO_BOI_DUONG = 'Đào tạo bồi dưỡng',
	HOP_TAC_NGUYEN_CUU_CHUYEN_GAO = 'Hợp tác - Nghiên cứu - chuyển giao',
	THUC_THI_CHINH_SACH = 'Thực thi, phát triển chính sách',
	HOAT_DONG_XA_HOI = 'Hoạt động xã hội',
	KHAC = 'Khác',
}

export enum ELoaiSuKienSinhVien {
	TUAN_LE_CONG_DAN = 'Tuần lễ công dân',
	HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI = 'Hoạt động huy động giáo dục tư tưởng chính trị các cấp',
	NGAY_HOI_VIEC_LAM = 'Ngày hội việc làm',
	HOI_THAO_CHUYEN_DE_VIEC_LAM = 'Hội thảo, nói chuyện chuyên đề về việc làm, đào tạo kỹ năng mềm',
	KHAC = 'Khác',
}

export const locationPathMappingToESuKienType: Record<string, ESuKienType> = {
	'cac-hoat-dong-cho-sinh-vien': ESuKienType.CAC_HOAT_DONG,
	'dao-tao-boi-duong': ESuKienType.DAO_TAO_BOI_DUONG,
	'hop-tac-nghien-cuu-chuyen-giao': ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO,
	'thuc-thi-chinh-sach': ESuKienType.THUC_THI_CHINH_SACH,
	'hoat-dong-xa-hoi': ESuKienType.HOAT_DONG_XA_HOI,
	khac: ESuKienType.KHAC,
};

export const ESuKienTypeMappingToLabel: Record<ESuKienType, string> = {
	[ESuKienType.CA_NHAN]: 'Cá nhân',
	[ESuKienType.TAT_CA]: 'Chung',
	[ESuKienType.CAC_HOAT_DONG]: 'Công tác sinh viên',
	[ESuKienType.DAO_TAO_BOI_DUONG]: 'Đào tạo bồi dưỡng',
	[ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO]: 'Hợp tác quốc tế, nghiên cứu khoa học và chuyển giao công nghệ',
	[ESuKienType.THUC_THI_CHINH_SACH]: 'Thực thi, phát triển chính sách',
	[ESuKienType.HOAT_DONG_XA_HOI]: 'Hoạt động xã hội',
	[ESuKienType.KHAC]: 'Các đơn vị ngoài học viện',
};

export const ETrangThaiDienRaMappingToTagLabel: Record<ETrangThaiDienRa, string> = {
	[ETrangThaiDienRa.CHUA_DIEN_RA]: 'Chưa diễn ra',
	[ETrangThaiDienRa.DANG_DIEN_RA]: 'Đang diễn ra',
	[ETrangThaiDienRa.DA_DIEN_RA]: 'Đã kết thúc',
};

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
export const ESuKienTypeMappingToColorSuKien: Record<ESuKienType, string> = {
	[ESuKienType.CAC_HOAT_DONG]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.CA_NHAN]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.DAO_TAO_BOI_DUONG]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.HOAT_DONG_XA_HOI]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.TAT_CA]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.THUC_THI_CHINH_SACH]: 'rgba(32, 152, 199, 0.7)',
	[ESuKienType.KHAC]: 'rgba(32, 152, 199, 0.7)',
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
	LICH_GIANG_DAY = 'Lịch giảng dạy',
	LICH_HOC = 'Lịch học',
	LICH_THI = 'Lịch thi',
	CA_NHAN = 'Cá nhân',
	CHUNG = 'Chung',
}
export const ELoaiSuKienColorSuKien = {
	[ELoaiSuKien.LICH_GIANG_DAY]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_HOC]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_THI]: 'rgba(223, 68, 113, 0.7)',
	[ELoaiSuKien.CA_NHAN]: 'rgba(87, 191, 86, 0.7)',
	[ELoaiSuKien.CHUNG]: 'rgba(32, 152, 199, 0.7)',
};

export const ColorSuKien = {
	[ELoaiSuKien.LICH_GIANG_DAY]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_HOC]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_THI]: 'rgba(223, 68, 113, 0.7)',
	[ELoaiSuKien.CA_NHAN]: 'rgba(87, 191, 86, 0.7)',
	[ELoaiSuKien.CHUNG]: 'rgba(32, 152, 199, 0.7)',
};
