import { AdvisingBookingStatus, AdvisingMode } from '@/services/Advising/constant';

export const ADVISING_BOOKING_STATUS_TAG_COLOR: Record<AdvisingBookingStatus, string> = {
	[AdvisingBookingStatus.CONFIRMED]: 'processing',
	[AdvisingBookingStatus.COMPLETED]: 'success',
	// NO_SHOW là kết quả tiêu cực nhưng không phải lỗi hệ thống như CANCELLED — tách màu để phân biệt
	// "sinh viên không đến" với "lịch đã bị huỷ".
	[AdvisingBookingStatus.NO_SHOW]: 'warning',
	[AdvisingBookingStatus.CANCELLED]: 'error',
};

export const ADVISING_MODE_TAG_COLOR: Record<AdvisingMode, string> = {
	[AdvisingMode.ONLINE]: 'blue',
	[AdvisingMode.OFFLINE]: 'purple',
};
