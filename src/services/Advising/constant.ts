export const AdvisingMode = {
	ONLINE: 'ONLINE',
	OFFLINE: 'OFFLINE',
} as const;
export type AdvisingMode = (typeof AdvisingMode)[keyof typeof AdvisingMode];

export const ADVISING_MODE_LABEL_KEY: Record<AdvisingMode, string> = {
	ONLINE: 'advisorAppointment.mode.ONLINE',
	OFFLINE: 'advisorAppointment.mode.OFFLINE',
};

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

/** Danh sách loại tư vấn cho Segmented/Select ở màn đặt lịch. */
export const ADVISING_TYPE_OPTIONS: AdvisingType[] = [AdvisingType.ACADEMIC, AdvisingType.NON_ACADEMIC];

export const ADVISING_TYPE_LABEL_KEY: Record<AdvisingType, string> = {
	ACADEMIC: 'advisorAppointment.advisingType.ACADEMIC',
	NON_ACADEMIC: 'advisorAppointment.advisingType.NON_ACADEMIC',
};

export const AdvisingBookingStatus = {
	CONFIRMED: 'CONFIRMED',
	CANCELLED: 'CANCELLED',
	COMPLETED: 'COMPLETED',
	/** Sinh viên không có mặt ở buổi đã đặt — khác CANCELLED ở chỗ lịch không hề bị huỷ trước đó. */
	NO_SHOW: 'NO_SHOW',
} as const;
export type AdvisingBookingStatus = (typeof AdvisingBookingStatus)[keyof typeof AdvisingBookingStatus];

/** Danh sách trạng thái booking cho bộ lọc ở bảng "Lịch đã đặt của tôi". */
export const ADVISING_BOOKING_STATUS_OPTIONS: AdvisingBookingStatus[] = [
	AdvisingBookingStatus.CONFIRMED,
	AdvisingBookingStatus.COMPLETED,
	AdvisingBookingStatus.NO_SHOW,
	AdvisingBookingStatus.CANCELLED,
];

export const ADVISING_BOOKING_STATUS_LABEL_KEY: Record<AdvisingBookingStatus, string> = {
	CONFIRMED: 'advisorAppointment.bookingStatus.CONFIRMED',
	CANCELLED: 'advisorAppointment.bookingStatus.CANCELLED',
	COMPLETED: 'advisorAppointment.bookingStatus.COMPLETED',
	NO_SHOW: 'advisorAppointment.bookingStatus.NO_SHOW',
};

export const AdvisingCancelledBy = {
	STUDENT: 'STUDENT',
	ADVISOR: 'ADVISOR',
	SAM: 'SAM',
} as const;
export type AdvisingCancelledBy = (typeof AdvisingCancelledBy)[keyof typeof AdvisingCancelledBy];

/** Độ dài tối đa của `topic` khi đặt lịch — theo `docs/advising-api.md` (1-2000 ký tự). */
export const ADVISING_TOPIC_MAX_LENGTH = 2000;
