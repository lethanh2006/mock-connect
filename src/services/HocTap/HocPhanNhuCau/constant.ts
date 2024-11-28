export enum ETrangThaisvđkHocPhanNhuCau {
	CHUA_DANG_KY = 'Chưa đăng ký',
	CHUA_DUYET = 'Chưa duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const mapNameTrangThaiSinhVienDangKyHocPhanNhuCau: Record<ETrangThaisvđkHocPhanNhuCau, string> = {
	[ETrangThaisvđkHocPhanNhuCau.CHUA_DANG_KY]: 'Chưa đăng ký',
	[ETrangThaisvđkHocPhanNhuCau.CHUA_DUYET]: 'Chờ CVHT duyệt',
	[ETrangThaisvđkHocPhanNhuCau.DA_DUYET]: 'Đã duyệt',
};

export const colorTrangThaiSinhVienDangKyHocPhanNhuCau: Record<ETrangThaisvđkHocPhanNhuCau, string> = {
	[ETrangThaisvđkHocPhanNhuCau.CHUA_DANG_KY]: 'orange',
	[ETrangThaisvđkHocPhanNhuCau.CHUA_DUYET]: 'blue',
	[ETrangThaisvđkHocPhanNhuCau.DA_DUYET]: 'green',
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
