export enum ETrangThaiSvDkHpNhuCau {
	CHUA_DANG_KY = 'Chưa đăng ký',
	CHUA_DUYET = 'Chưa duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const mapNameTrangThaiSvDkHpNhuCau: Record<ETrangThaiSvDkHpNhuCau, string> = {
	[ETrangThaiSvDkHpNhuCau.CHUA_DANG_KY]: 'Chưa đăng ký',
	[ETrangThaiSvDkHpNhuCau.CHUA_DUYET]: 'Chờ CVHT duyệt',
	[ETrangThaiSvDkHpNhuCau.DA_DUYET]: 'Đã duyệt',
};

export const colorTrangThaiSvDkHpNhuCau: Record<ETrangThaiSvDkHpNhuCau, string> = {
	[ETrangThaiSvDkHpNhuCau.CHUA_DANG_KY]: 'orange',
	[ETrangThaiSvDkHpNhuCau.CHUA_DUYET]: 'blue',
	[ETrangThaiSvDkHpNhuCau.DA_DUYET]: 'green',
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
