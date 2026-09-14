import { AdvisorChangeStatus } from '@/services/AdvisorChange/constant';

export const ADVISOR_CHANGE_STATUS_TAG_COLOR: Record<AdvisorChangeStatus, string> = {
	[AdvisorChangeStatus.PENDING]: 'processing',
	[AdvisorChangeStatus.APPROVED]: 'success',
	[AdvisorChangeStatus.REJECTED]: 'error',
};
