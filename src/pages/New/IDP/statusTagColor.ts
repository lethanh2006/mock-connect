import { IdpStatus } from '@/services/Idp/constant';

export const STATUS_TAG_COLOR: Record<IdpStatus, string> = {
	[IdpStatus.DRAFT]: 'default',
	[IdpStatus.PENDING]: 'processing',
	[IdpStatus.APPROVED]: 'success',
	[IdpStatus.REJECTED]: 'error',
	[IdpStatus.REVISION_REQUESTED]: 'warning',
};
