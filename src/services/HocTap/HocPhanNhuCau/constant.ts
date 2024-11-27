export enum ETrangThaiSinhVienDangKyHocPhanNhuCau {
	CHUA_DUYET = 'Chưa duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const mapNameTrangThaiSinhVienDangKyHocPhanNhuCau: Record<ETrangThaiSinhVienDangKyHocPhanNhuCau, string> = {
	[ETrangThaiSinhVienDangKyHocPhanNhuCau.CHUA_DUYET]: 'Chờ CVHT duyệt',
	[ETrangThaiSinhVienDangKyHocPhanNhuCau.DA_DUYET]: 'Đã duyệt',
};

export const colorTrangThaiSinhVienDangKyHocPhanNhuCau: Record<ETrangThaiSinhVienDangKyHocPhanNhuCau, string> = {
	[ETrangThaiSinhVienDangKyHocPhanNhuCau.CHUA_DUYET]: 'blue',
	[ETrangThaiSinhVienDangKyHocPhanNhuCau.DA_DUYET]: 'green',
};

export enum ETinhChatHocPhanNhuCau {
	DUNG_TIEN_TRINH = 'Trong tiến trình',
	NGOAI_TIEN_TRINH = 'Trong chương trình đào tạo',
	HOC_PHAN_KHAC = 'Ngoài chương trình đào tạo',
}

export const mapNameETinhChatHocPhanNhuCau: Record<ETinhChatHocPhanNhuCau, string> = {
	[ETinhChatHocPhanNhuCau.DUNG_TIEN_TRINH]: 'HP đúng tiến trình',
	[ETinhChatHocPhanNhuCau.NGOAI_TIEN_TRINH]: 'HP ngoài tiến trình',
	[ETinhChatHocPhanNhuCau.HOC_PHAN_KHAC]: 'HP khác',
};
