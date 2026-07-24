export enum EGiayToCanNopType {
	BAN_MEM = 'ban-mem',
	BAN_CUNG = 'ban-cung',
}

export const TenGiayToCanNopType: Record<EGiayToCanNopType, string> = {
	[EGiayToCanNopType.BAN_MEM]: 'dotnhaphoc.form.giayto.type.banmem',
	[EGiayToCanNopType.BAN_CUNG]: 'dotnhaphoc.form.giayto.type.bancung',
};
