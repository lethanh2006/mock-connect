export enum ELoaiPhieuDkCtdt {
	DEFAULT = 'default',
	PERSONAL = 'personal',
}

export enum ETrangThaiPhieuDkyCtdt {
	DRAFT = 'draft',
	PENDING = 'pending',
	APPROVE = 'approve',
}

export const trangThaiPhieuDkyCtdt: Record<ETrangThaiPhieuDkyCtdt, string> = {
	[ETrangThaiPhieuDkyCtdt.DRAFT]: 'Nháp',
	[ETrangThaiPhieuDkyCtdt.PENDING]: 'Chờ duyệt',
	[ETrangThaiPhieuDkyCtdt.APPROVE]: 'Đã duyệt',
};
