export enum EGiayToCanNopType {
	BAN_MEM = 'ban-mem',
	BAN_CUNG = 'ban-cung',
}

export enum EDoiTuongApDungGiayToNhapHoc {
	VIET_NAM = 'Việt Nam',
	QUOC_TE = 'Quốc tế',
}

const isVietnameseNationalityText = (nationality?: string) => {
	if (!nationality) return false;
	const normalized = nationality
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	return normalized.includes('viet nam');
};

/** [] = mọi người; "Việt Nam" / "Quốc tế" = chỉ đúng nhóm quốc tịch. */
export const isGiayToVisibleForNationality = (doiTuongApDung: string[] | undefined, nationality?: string) => {
	if (!doiTuongApDung?.length) return true;
	const isVN = isVietnameseNationalityText(nationality);
	const isIntl = Boolean(nationality) && !isVN;
	return (
		(isVN && doiTuongApDung.includes(EDoiTuongApDungGiayToNhapHoc.VIET_NAM)) ||
		(isIntl && doiTuongApDung.includes(EDoiTuongApDungGiayToNhapHoc.QUOC_TE))
	);
};

export const TenGiayToCanNopType: Record<EGiayToCanNopType, string> = {
	[EGiayToCanNopType.BAN_MEM]: 'dotnhaphoc.form.giayto.type.banmem',
	[EGiayToCanNopType.BAN_CUNG]: 'dotnhaphoc.form.giayto.type.bancung',
};
