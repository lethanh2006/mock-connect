export enum ETrangThaiChamDiem {
	DANG_CHAM = 'DANG_CHAM',
	DA_CHAM_XONG = 'DA_CHAM_XONG',
	DANG_NIEM_YET = 'DANG_NIEM_YET',
	DA_NIEM_YET = 'DA_NIEM_YET',
	DANG_XU_LY_KHIEU_NAI = 'DANG_XU_LY_KHIEU_NAI',
	DA_CONG_BO = 'DA_CONG_BO',
}

export const MapKeyNameTrangThaiChamDiem = {
	[ETrangThaiChamDiem.DANG_CHAM]: 'Đang chấm',
	[ETrangThaiChamDiem.DANG_XU_LY_KHIEU_NAI]: 'Đang xử lý khiếu nại',
	[ETrangThaiChamDiem.DA_CHAM_XONG]: 'Đã chấm xong',
	[ETrangThaiChamDiem.DA_CONG_BO]: 'Đã công bố',
	[ETrangThaiChamDiem.DANG_NIEM_YET]: 'Đang niêm yết',
	[ETrangThaiChamDiem.DA_NIEM_YET]: 'Đã niêm yết',
};
export const MapKeyColorTrangThaiChamDiem = {
	[ETrangThaiChamDiem.DANG_CHAM]: 'yellow',
	[ETrangThaiChamDiem.DANG_XU_LY_KHIEU_NAI]: 'blue',
	[ETrangThaiChamDiem.DA_CHAM_XONG]: 'green',
	[ETrangThaiChamDiem.DA_CONG_BO]: 'green',
	[ETrangThaiChamDiem.DANG_NIEM_YET]: 'yellow',
	[ETrangThaiChamDiem.DA_NIEM_YET]: 'blue',
};

export enum EXepLoaiRenLuyen {
	XUAT_SAC = 'XUAT_SAC',
	TOT = 'TOT',
	KHA = 'KHA',
	TRUNG_BINH = 'TRUNG_BINH',
	YEU = 'YEU',
	KEM = 'KEM',
	// KHONG_THAM_GIA = 'KHONG_THAM_GIA',
	CHUA_XEP_LOAI = 'CHUA_XEP_LOAI',
}

export const xepLoaiRenLuyen: Record<EXepLoaiRenLuyen, string> = {
	[EXepLoaiRenLuyen.XUAT_SAC]: 'Xuất sắc',
	[EXepLoaiRenLuyen.TOT]: 'Tốt',
	[EXepLoaiRenLuyen.KHA]: 'Khá',
	[EXepLoaiRenLuyen.TRUNG_BINH]: 'Trung bình',
	[EXepLoaiRenLuyen.YEU]: 'Yếu',
	[EXepLoaiRenLuyen.KEM]: 'Kém',
	// [EXepLoaiRenLuyen.KHONG_THAM_GIA]: 'Không tham gia đánh giá',
	[EXepLoaiRenLuyen.CHUA_XEP_LOAI]: 'Chưa xếp loại',
};

export const colorXepLoaiRenLuyen: Record<EXepLoaiRenLuyen, string> = {
	[EXepLoaiRenLuyen.XUAT_SAC]: '#52c41a',
	[EXepLoaiRenLuyen.TOT]: '#7ecb08',
	[EXepLoaiRenLuyen.KHA]: '#f1e20b',
	[EXepLoaiRenLuyen.TRUNG_BINH]: '#ffc20a',
	[EXepLoaiRenLuyen.YEU]: '#ef9b20',
	[EXepLoaiRenLuyen.KEM]: '#ea5545',
	[EXepLoaiRenLuyen.CHUA_XEP_LOAI]: '#939393',
};
