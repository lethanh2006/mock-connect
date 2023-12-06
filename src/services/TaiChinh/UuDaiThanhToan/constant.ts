export enum ELoaiUuDaiThanhToan {
	GIAO_DICH = 'GIAO_DICH',
	DOT = 'DOT',
}

export const loaiUuDaiThanhToan: Record<ELoaiUuDaiThanhToan, string> = {
	[ELoaiUuDaiThanhToan.DOT]: 'Ưu đãi theo đợt thu',
	[ELoaiUuDaiThanhToan.GIAO_DICH]: 'Ưu đãi theo giao dịch',
};
