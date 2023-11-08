export enum TrangThaiKhaiBao {
	DA_KHAI_BAO = 'Đã khai báo',
	CHUA_KHAI_BAO = 'Chưa khai báo',
}
export enum TrangThaiTiepNhan {
	CHUA_CO = 'Chưa có kết quả tiếp nhận',
	DA_DUYET = 'Chưa khai báo',
	KHONG_DUYET = 'Không duyệt',
	CHINH_SUA_LAI = 'Chỉnh sửa lại',
}

export const MapColorTrangThaiTiepNhan = {
	[TrangThaiTiepNhan.CHUA_CO]: '#0d6efd',
	[TrangThaiTiepNhan.DA_DUYET]: '#1fba36',
	[TrangThaiTiepNhan.KHONG_DUYET]: '#dc3545',
	[TrangThaiTiepNhan.CHINH_SUA_LAI]: '#ffca2c',
};
export enum TrangThaiTiepNhanDon {
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	CHINH_SUA_LAI = 'Chỉnh sửa lại',
	DA_CHINH_SUA_LAI = 'Đã chỉnh sửa lại',
	CHUA_CO = 'Chưa có kết quả tiếp nhận',
}
export const MapColorTrangThaiTiepNhanDon = {
	[TrangThaiTiepNhanDon.CHINH_SUA_LAI]: '#ffca2c',
	[TrangThaiTiepNhanDon.CHUA_CO]: '#0d6efd',
	[TrangThaiTiepNhanDon.DUYET]: '#1fba36',
	[TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI]: '#0dcaf0',
	[TrangThaiTiepNhanDon.KHONG_DUYET]: '#dc3545',
};
