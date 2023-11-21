export enum ETinhTrangSucKhoe {
	BINH_THUONG = 'Bình thường',
	CO_BENH = 'Có bệnh',
	CHUA_DANH_GIA = 'Chưa đánh giá',
}

export const colorETinhTrangSucKhoe: Record<ETinhTrangSucKhoe, string> = {
	[ETinhTrangSucKhoe.BINH_THUONG]: 'green',
	[ETinhTrangSucKhoe.CO_BENH]: 'red',
	[ETinhTrangSucKhoe.CHUA_DANH_GIA]: 'default',
};
