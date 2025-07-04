export enum ETrangThaiDuyetBienBanHopDiemRenLuyen {
	CHUA_GUI = 'Chưa gửi',
	CHO_DUYET = 'Chờ duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu câu chỉnh sửa',
	DA_DUYET = 'Đã duyệt',
}

export const MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen = {
	[ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET]: '#1890ff',
	[ETrangThaiDuyetBienBanHopDiemRenLuyen.CHUA_GUI]: '#dc3545',
	[ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET]: '#28a745',
	[ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA]: '#ffc107',
};
