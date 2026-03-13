export enum PhuongThucPhanCong {
	TO_CHUC = 'Tổ chức nhân sự - Đơn vị',
	NGUOI_CU_THE = 'Người cụ thể',
  CO_VAN_HOC_TAP = 'Cố vấn học tập',
}
export enum DoiTuongDieuPhoi {
	NGUOI_CU_THE = 'Người dùng',
	TO_CHUC = 'Bộ phận xử lý',
}
export const MapKeyPhuongThucPhanCong = {
	[PhuongThucPhanCong.TO_CHUC]: 'Đơn vị cụ thể',
	[PhuongThucPhanCong.NGUOI_CU_THE]: 'Người cụ thể',
  [PhuongThucPhanCong.CO_VAN_HOC_TAP]: 'Cố vấn học tập',
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
export enum ENguonDot {
	TU_TAO = 'Tự tạo',
	PHAN_HE = 'Lấy từ phân hệ',
	KHONG_CO_DOT = 'Không có đợt',
}

export enum EPhanHe {
	VWA_CONNECT = 'VWA_CONNECT',
	CONG_CAN_BO = 'CONG_CAN_BO',
	CONG_TAC_SINH_VIEN = 'CONG_TAC_SINH_VIEN',
	VAN_PHONG_DIEU_HANH = 'VAN_PHONG_DIEU_HANH',
	QUAN_LY_KHOA_HOC = 'QUAN_LY_KHOA_HOC',
	TCNS = 'TCNS',
	QLDT = 'QLDT',
}
