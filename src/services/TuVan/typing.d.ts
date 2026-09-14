import type {
	AdvisingBookingStatus,
	AdvisingCancelledBy,
	AdvisingMode,
	AdvisingSlotStatus,
	AdvisingType,
	AdvisorType,
} from './constant';

declare module TuVan {
	export interface ISlot {
		_id: string;
		advisorSsoId: string;
		advisorName: string;
		advisorType: AdvisorType;
		startAt: string; // ISO datetime, UTC+0
		endAt: string; // ISO datetime, UTC+0
		mode: AdvisingMode;
		location?: string; // địa điểm (OFFLINE) hoặc link tham gia (ONLINE)
		meetingLink?: string;
		note?: string;
		capacity: number;
		bookedCount: number;
		status: AdvisingSlotStatus;
		cancelledAt?: string;
		createdAt: string;
		updatedAt: string;
	}

	/**
	 * 1 phần tử trong `POST /advising/slots` — mỗi phần tử là 1 ca độc lập, đầy đủ field.
	 * `location`/`meetingLink` loại trừ nhau theo `mode`: OFFLINE gửi `location` (không gửi `meetingLink`),
	 * ONLINE gửi `meetingLink` (không gửi `location`).
	 */
	export interface ISlotCellInput {
		startAt: string;
		endAt: string;
		mode: AdvisingMode;
		location?: string; // bắt buộc nếu mode = OFFLINE
		meetingLink?: string; // bắt buộc nếu mode = ONLINE
		note?: string;
		capacity: number;
	}

	/** Payload `POST /advising/slots`. */
	export interface ICreateSlotRequest {
		items: ISlotCellInput[];
	}

	/** Payload `PUT /advising/slots/:id`. */
	export type IUpdateSlotRequest = Partial<ISlotCellInput>;

	/** Payload `PUT /advising/slots/:id/cancel`. */
	export interface ICancelSlotRequest {
		reason: string;
	}

	export interface IBooking {
		_id: string;
		slotId: string;
		advisingType: AdvisingType;
		advisorSsoId: string;
		advisorName: string;
		maNam: string;
		mode: AdvisingMode;
		location?: string;
		startAt: string;
		endAt: string;
		studentSsoId: string;
		studentCode: string;
		studentName: string;
		studentEmail?: string;
		studentPhone?: string;
		studentAddress?: string;
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
	}

	/**
	 * Payload `PUT /advising/bookings/:id/result`. Chỉ ghi được 1 lần khi booking đang `CONFIRMED`,
	 * chưa có `resultRecordedAt`, và đã tới/qua giờ hẹn (`now >= startAt`).
	 * `attended=true` → bắt buộc đủ 3 field, set status=COMPLETED. `attended=false` → bỏ trống 3 field, set status=NO_SHOW.
	 */
	export interface IRecordResultRequest {
		attended: boolean;
		objective?: string; // bắt buộc nếu attended = true
		outcome?: string; // bắt buộc nếu attended = true
		nextStep?: string; // bắt buộc nếu attended = true
	}

	/**
	 * Payload `POST /advising/bookings/advisor/students` — cố vấn thêm (nhiều) sinh viên vào 1 ca (slot) đang mở
	 * của chính mình. UI hiện tại chỉ cho chọn 1 sinh viên/lần nên `studentSsoIds` luôn có đúng 1 phần tử.
	 */
	export interface IAddStudentsToSlotRequest {
		slotId: string;
		studentSsoIds: string[];
		advisingType: AdvisingType;
		topic: string;
	}

	/** Payload `PUT /advising/bookings/advisor/:id` — cố vấn sửa 1 lịch đã đặt trong slot của mình. Chỉ sửa được nội dung. */
	export interface IUpdateBookingRequest {
		topic: string;
	}

	/** Payload `PUT /advising/bookings/advisor/:id/cancel` — cố vấn huỷ 1 lịch đã đặt trong slot của mình. */
	export interface ICancelBookingRequest {
		reason: string;
	}

	/** Trả về từ `GET /advising/bookings/advisor/me/stats`. */
	export interface IAdvisingBookingStats {
		total: number;
		confirmed: number;
		completed: number;
		cancelled: number;
		noShow: number;
	}
}
