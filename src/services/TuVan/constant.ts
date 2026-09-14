export const AdvisorType = {
	FACULTY_ADVISOR: 'FACULTY_ADVISOR',
	PEER_ADVISOR: 'PEER_ADVISOR',
	PROFESSIONAL_ADVISOR: 'PROFESSIONAL_ADVISOR',
} as const;
export type AdvisorType = (typeof AdvisorType)[keyof typeof AdvisorType];

export const AdvisingMode = {
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE',
} as const;
export type AdvisingMode = (typeof AdvisingMode)[keyof typeof AdvisingMode];

export const AdvisingSlotStatus = {
	OPEN: 'OPEN',
	CANCELLED: 'CANCELLED',
} as const;
export type AdvisingSlotStatus = (typeof AdvisingSlotStatus)[keyof typeof AdvisingSlotStatus];

export const AdvisingType = {
	ACADEMIC: 'ACADEMIC',
	NON_ACADEMIC: 'NON_ACADEMIC',
} as const;
export type AdvisingType = (typeof AdvisingType)[keyof typeof AdvisingType];

export const AdvisingBookingStatus = {
	CONFIRMED: 'CONFIRMED',
	CANCELLED: 'CANCELLED',
	COMPLETED: 'COMPLETED',
	NO_SHOW: 'NO_SHOW',
} as const;
export type AdvisingBookingStatus = (typeof AdvisingBookingStatus)[keyof typeof AdvisingBookingStatus];

export const AdvisingCancelledBy = {
	STUDENT: 'STUDENT',
	ADVISOR: 'ADVISOR',
	SAM: 'SAM',
} as const;
export type AdvisingCancelledBy = (typeof AdvisingCancelledBy)[keyof typeof AdvisingCancelledBy];

export const ADVISOR_TYPE_LABEL_KEY: Record<AdvisorType, string> = {
	FACULTY_ADVISOR: 'tuvan.advisorType.FACULTY_ADVISOR',
	PEER_ADVISOR: 'tuvan.advisorType.PEER_ADVISOR',
	PROFESSIONAL_ADVISOR: 'tuvan.advisorType.PROFESSIONAL_ADVISOR',
};

export const ADVISING_MODE_LABEL_KEY: Record<AdvisingMode, string> = {
	ONLINE: 'tuvan.mode.ONLINE',
	OFFLINE: 'tuvan.mode.OFFLINE',
};

export const ADVISING_SLOT_STATUS_LABEL_KEY: Record<AdvisingSlotStatus, string> = {
	OPEN: 'tuvan.slotStatus.OPEN',
	CANCELLED: 'tuvan.slotStatus.CANCELLED',
};

export const ADVISING_TYPE_LABEL_KEY: Record<AdvisingType, string> = {
	ACADEMIC: 'tuvan.type.ACADEMIC',
	NON_ACADEMIC: 'tuvan.type.NON_ACADEMIC',
};

export const ADVISING_BOOKING_STATUS_LABEL_KEY: Record<AdvisingBookingStatus, string> = {
	CONFIRMED: 'tuvan.bookingStatus.CONFIRMED',
	CANCELLED: 'tuvan.bookingStatus.CANCELLED',
	COMPLETED: 'tuvan.bookingStatus.COMPLETED',
	NO_SHOW: 'tuvan.bookingStatus.NO_SHOW',
};

export const ADVISING_CANCELLED_BY_LABEL_KEY: Record<AdvisingCancelledBy, string> = {
	STUDENT: 'tuvan.cancelledBy.STUDENT',
	ADVISOR: 'tuvan.cancelledBy.ADVISOR',
	SAM: 'tuvan.cancelledBy.SAM',
};
