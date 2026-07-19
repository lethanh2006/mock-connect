export enum ETrangThaiCardLopHp {
	HIEN_TAI = 'HIEN_TAI',
	SAP_TOI = 'SAP_TOI',
	DANG_HOC = 'DANG_HOC',
}

export const colorTrangThaiCardLopHp: Record<ETrangThaiCardLopHp, string> = {
	[ETrangThaiCardLopHp.HIEN_TAI]: 'green',
	[ETrangThaiCardLopHp.SAP_TOI]: 'orange',
	[ETrangThaiCardLopHp.DANG_HOC]: 'blue',
};

export const labelTrangThaiCardLopHp: Record<ETrangThaiCardLopHp, string> = {
	[ETrangThaiCardLopHp.HIEN_TAI]: 'lophocphan.card.hientai',
	[ETrangThaiCardLopHp.SAP_TOI]: 'lophocphan.card.saptoi',
	[ETrangThaiCardLopHp.DANG_HOC]: 'lophocphan.card.v2.danghoc',
};
