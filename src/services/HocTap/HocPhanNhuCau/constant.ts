export enum ETrangThaiSvDkHpNhuCau {
	CHUA_DANG_KY = 'Chưa đăng ký',
	CHUA_DUYET = 'Chưa duyệt',
	DA_DUYET = 'Đã duyệt',
}

export const mapNameTrangThaiSvDkHpNhuCau: Record<ETrangThaiSvDkHpNhuCau, string> = {
	[ETrangThaiSvDkHpNhuCau.CHUA_DANG_KY]: 'hocphannhucau.svStatus.chuaDangKy',
	[ETrangThaiSvDkHpNhuCau.CHUA_DUYET]: 'hocphannhucau.svStatus.choCvht',
	[ETrangThaiSvDkHpNhuCau.DA_DUYET]: 'hocphannhucau.svStatus.daXacNhan',
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
	[ETinhChatHocPhanNhuCau.DUNG_TIEN_TRINH]: 'hocphannhucau.tinhChat.hpDungTienTrinh',
	[ETinhChatHocPhanNhuCau.NGOAI_TIEN_TRINH]: 'hocphannhucau.tinhChat.hpNgoaiTienTrinh',
	[ETinhChatHocPhanNhuCau.HOC_PHAN_KHAC]: 'hocphannhucau.tinhChat.hpKhac',
};
