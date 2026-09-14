export const IdpStatus = {
	DRAFT: 'DRAFT',
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
	REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const;
export type IdpStatus = (typeof IdpStatus)[keyof typeof IdpStatus];

export const IDP_REVIEW_STATUS = [IdpStatus.APPROVED, IdpStatus.REVISION_REQUESTED, IdpStatus.REJECTED] as const;
export type IdpReviewStatus = (typeof IDP_REVIEW_STATUS)[number];

export const IDP_STATUS_LABEL_KEY: Record<IdpStatus, string> = {
	DRAFT: 'idpcovan.status.DRAFT',
	PENDING: 'idpcovan.status.PENDING',
	APPROVED: 'idpcovan.status.APPROVED',
	REJECTED: 'idpcovan.status.REJECTED',
	REVISION_REQUESTED: 'idpcovan.status.REVISION_REQUESTED',
};
