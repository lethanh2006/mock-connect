export enum ETrangThaiDangKyChuyenNganh {
	CHO_DUYET = 'CHO_DUYET',
	// XAC_NHAN = 'XAC_NHAN',
	DA_DUYET = 'DA_DUYET',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
	KHONG_DUYET = 'KHONG_DUYET',
}

export const trangThaiDangKyChuyenNganh: Record<ETrangThaiDangKyChuyenNganh, string> = {
	[ETrangThaiDangKyChuyenNganh.CHO_DUYET]: 'Chờ duyệt',
	// [ETrangThaiDangKyChuyenNganh.XAC_NHAN]: 'Xác nhận',
	[ETrangThaiDangKyChuyenNganh.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
	[ETrangThaiDangKyChuyenNganh.KHONG_DUYET]: 'Không duyệt',
};

export const colorTrangThaiDangKyChuyenNganh: Record<ETrangThaiDangKyChuyenNganh, string> = {
	[ETrangThaiDangKyChuyenNganh.CHO_DUYET]: 'blue',
	// [ETrangThaiDangKyChuyenNganh.XAC_NHAN]: 'purple',
	[ETrangThaiDangKyChuyenNganh.DA_DUYET]: 'green',
	[ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA]: 'orange',
	[ETrangThaiDangKyChuyenNganh.KHONG_DUYET]: 'red',
};
