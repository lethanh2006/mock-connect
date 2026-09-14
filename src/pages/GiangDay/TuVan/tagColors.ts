import { AdvisingBookingStatus, AdvisingMode, AdvisingSlotStatus } from '@/services/TuVan/constant';

export const SLOT_STATUS_TAG_COLOR: Record<AdvisingSlotStatus, string> = {
	[AdvisingSlotStatus.OPEN]: 'success',
	[AdvisingSlotStatus.CANCELLED]: 'error',
};

export const BOOKING_STATUS_TAG_COLOR: Record<AdvisingBookingStatus, string> = {
	[AdvisingBookingStatus.CONFIRMED]: 'processing',
	[AdvisingBookingStatus.COMPLETED]: 'success',
	[AdvisingBookingStatus.CANCELLED]: 'error',
	[AdvisingBookingStatus.NO_SHOW]: 'warning',
};

export const ADVISING_MODE_TAG_COLOR: Record<AdvisingMode, string> = {
	[AdvisingMode.OFFLINE]: 'blue',
	[AdvisingMode.ONLINE]: 'purple',
};
