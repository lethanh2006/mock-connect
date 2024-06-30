export enum ETrangThaiHoiDongKHCN {
	DANG_DIEN_RA = 'Đang diễn ra',
	CHUA_DIEN_RA = 'Chưa diễn ra',
	DA_KET_THUC = 'Đã diễn ra',
}
export enum ELoaiHoiDongKHCN {
	XET_DUYET = 'Xét duyệt',
	DE_CUONG = 'Đề cương',
	NGHIEM_THU = 'Nghiệm thu',
}

export const MapKeyNameLoaiHoiDongKHCN = {
	[ELoaiHoiDongKHCN.DE_CUONG]: 'Hội đồng xét duyệt thuyết minh',
	[ELoaiHoiDongKHCN.XET_DUYET]: 'Hội đồng xét chọn đề xuất',
	[ELoaiHoiDongKHCN.NGHIEM_THU]: 'Hội đồng nghiệm thu',
};

export const MapkeyColorTrangThaiHoiDongKHCN = {
	[ETrangThaiHoiDongKHCN.DANG_DIEN_RA]: '#28a745',
	[ETrangThaiHoiDongKHCN.CHUA_DIEN_RA]: '#007bff',
	[ETrangThaiHoiDongKHCN.DA_KET_THUC]: '#dc3545',
};
