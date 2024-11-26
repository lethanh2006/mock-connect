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
	TRONG_TIEN_TRINH = 'Trong tiến trình',
	TRONG_CTDT = 'Trong chương trình đào tạo',
	NGOAI_CTDT = 'Ngoài chương trình đào tạo',
}
