export enum ETrangThaiNopBaiTap {
	CHUA_NOP = 'CHUA_NOP',
	NHAP = 'NHAP',
	DA_NOP = 'DA_NOP',
}

export const mapTrangThaiNopBaiTap: Record<ETrangThaiNopBaiTap, string> = {
	[ETrangThaiNopBaiTap.CHUA_NOP]: 'Chưa nộp',
	[ETrangThaiNopBaiTap.NHAP]: 'Nháp',
	[ETrangThaiNopBaiTap.DA_NOP]: 'Đã nộp',
};

export const colorTrangThaiNopBaiTap: Record<ETrangThaiNopBaiTap, string> = {
	[ETrangThaiNopBaiTap.CHUA_NOP]: 'red',
	[ETrangThaiNopBaiTap.NHAP]: 'orange',
	[ETrangThaiNopBaiTap.DA_NOP]: 'green',
};
