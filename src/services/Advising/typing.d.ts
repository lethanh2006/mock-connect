import type { EAdvisorType } from '@/services/AdvisorChange/constant';
import type {
	AdvisingBookingStatus,
	AdvisingCancelledBy,
	AdvisingMode,
	AdvisingSlotStatus,
	AdvisingType,
} from './constant';

declare module Advising {
	export interface IAdvisorSummary {
		advisorSsoId: string;
		advisorName: string;
		advisorType: EAdvisorType;
	}

	export interface ISlot {
		_id: string;
		advisorSsoId: string;
		advisorName: string;
		advisorType: EAdvisorType;
		/** ISO datetime, UTC+0. */
		startAt: string;
		endAt: string;
		mode: AdvisingMode;
		location?: string;
		meetingLink?: string;
		note?: string;
		capacity: number;
		bookedCount: number;
		status: AdvisingSlotStatus;
		cancelledAt?: string;
		createdAt: string;
		updatedAt: string;
		isBooked?: boolean;
	}

	export interface ICreateBookingRequest {
		slotId: string;
		advisingType: AdvisingType;
		topic: string;
	}

	export interface IBooking {
		_id: string;
		slotId: string;
		advisingType: AdvisingType;
		advisorSsoId: string;
		advisorName: string;
		mode: AdvisingMode;
		location?: string;
		startAt: string;
		endAt: string;
		studentSsoId: string;
		studentCode: string;
		studentName: string;
		topic: string;
		status: AdvisingBookingStatus;
		cancelledBy?: AdvisingCancelledBy;
		cancelReason?: string;
		cancelledAt?: string;
		rescheduledFromBookingId?: string;
		objective?: string;
		outcome?: string;
		nextStep?: string;
		resultRecordedAt?: string;
		resultRecordedBySsoId?: string;
		resultRecordedByName?: string;
		createdAt: string;
		updatedAt: string;

		maNam?: string;
	}
}
