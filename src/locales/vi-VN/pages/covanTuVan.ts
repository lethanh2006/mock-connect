export default {
	'tuvan.khadung.title': 'Khung giờ tư vấn khả dụng',
	'tuvan.khadung.modalTitle': 'Ca tư vấn',
	'tuvan.yeucau.title': 'Yêu cầu đặt lịch tư vấn',

	// Card thống kê
	'tuvan.stat.total': 'Tổng số lịch',
	'tuvan.stat.confirmed': 'Đã xác nhận',
	'tuvan.stat.completed': 'Đã hoàn thành',
	'tuvan.stat.noShow': 'Sinh viên vắng mặt',
	'tuvan.stat.cancelled': 'Đã huỷ',
	'tuvan.yeucau.modalTitle': 'Yêu cầu đặt lịch của {name} ({code})',
	'tuvan.yeucau.form.createTitle': 'Tạo lịch tư vấn mới',
	'tuvan.yeucau.form.editTitle': 'Sửa lịch tư vấn của {name} ({code})',

	// Loại cố vấn
	'tuvan.advisorType.FACULTY_ADVISOR': 'Cố vấn học tập',
	'tuvan.advisorType.PEER_ADVISOR': 'Cố vấn đồng trang lứa',
	'tuvan.advisorType.PROFESSIONAL_ADVISOR': 'Cố vấn nghề nghiệp',

	// Hình thức tư vấn
	'tuvan.mode.OFFLINE': 'Trực tiếp',
	'tuvan.mode.ONLINE': 'Trực tuyến',

	// Loại tư vấn (sinh viên chọn khi đặt lịch)
	'tuvan.type.ACADEMIC': 'Học thuật',
	'tuvan.type.NON_ACADEMIC': 'Ngoài học thuật',

	// Trạng thái ca tư vấn
	'tuvan.slotStatus.OPEN': 'Còn mở',
	'tuvan.slotStatus.FULL': 'Đã đầy',
	'tuvan.slotStatus.CANCELLED': 'Đã huỷ',

	// Trạng thái yêu cầu đặt lịch
	'tuvan.bookingStatus.CONFIRMED': 'Đã xác nhận',
	'tuvan.bookingStatus.CANCELLED': 'Đã huỷ',
	'tuvan.bookingStatus.COMPLETED': 'Đã hoàn thành',
	'tuvan.bookingStatus.NO_SHOW': 'Sinh viên vắng mặt',

	// Người huỷ booking
	'tuvan.cancelledBy.STUDENT': 'Sinh viên',
	'tuvan.cancelledBy.ADVISOR': 'Cố vấn',
	'tuvan.cancelledBy.SAM': 'Hệ thống',

	// Cột bảng — dùng chung cho cả 2 màn
	'tuvan.column.action': 'Hành động',
	'tuvan.column.date': 'Ngày',
	'tuvan.column.time': 'Khung giờ',
	'tuvan.column.mode': 'Hình thức',
	'tuvan.column.locationOrLink': 'Địa điểm / Link',
	'tuvan.column.booked': 'Đã đặt',
	'tuvan.column.slotStatus': 'Trạng thái',
	'tuvan.column.bookingStatus': 'Trạng thái',
	'tuvan.column.studentCode': 'Mã sinh viên',
	'tuvan.column.studentName': 'Họ và tên',
	'tuvan.column.studentEmail': 'Email',
	'tuvan.column.studentPhone': 'Số điện thoại',
	'tuvan.column.studentAddress': 'Địa chỉ',
	'tuvan.column.createdAt': 'Ngày đặt',

	'tuvan.tooltip.edit': 'Sửa ca tư vấn',
	'tuvan.tooltip.cancel': 'Huỷ ca tư vấn',
	'tuvan.tooltip.delete': 'Xoá ca tư vấn',
	'tuvan.tooltip.slotCancelledHint': 'Ca đã huỷ, không thể thao tác',
	'tuvan.tooltip.slotHasBookingsHint': 'Ca đã có sinh viên đặt, không thể xoá — dùng nút Huỷ thay thế',
	'tuvan.tooltip.viewDetail': 'Xem chi tiết',
	'tuvan.tooltip.editBooking': 'Sửa lịch tư vấn',
	'tuvan.tooltip.editBookingDisabledHint': 'Chỉ sửa được khi yêu cầu đang ở trạng thái Đã xác nhận',
	'tuvan.tooltip.cancelBooking': 'Huỷ lịch tư vấn',
	'tuvan.tooltip.cancelBookingDisabledHint': 'Chỉ huỷ được khi yêu cầu đang ở trạng thái Đã xác nhận',
	'tuvan.tooltip.recordResult': 'Ghi nhận kết quả buổi tư vấn',
	'tuvan.tooltip.resultAlreadyRecordedHint': 'Đã ghi nhận kết quả buổi tư vấn này rồi',
	'tuvan.tooltip.resultNotConfirmedHint': 'Chỉ ghi nhận được khi yêu cầu đang ở trạng thái Đã xác nhận',
	'tuvan.tooltip.resultTooEarlyHint': 'Chưa tới giờ hẹn, chưa thể ghi nhận kết quả',
	'tuvan.tooltip.overdueUnresolved': 'Đã qua giờ hẹn nhưng chưa ghi nhận kết quả buổi tư vấn này',
	'tuvan.confirm.deleteSlot': 'Bạn có chắc chắn muốn xoá ca tư vấn này?',

	// Form khai báo ca tư vấn
	'tuvan.form.mode': 'Hình thức tư vấn',
	'tuvan.form.locationOffline': 'Địa điểm',
	'tuvan.form.locationOfflinePlaceholder': 'Nhập địa điểm tư vấn trực tiếp...',
	'tuvan.form.locationOnline': 'Link tham gia',
	'tuvan.form.locationOnlinePlaceholder': 'Nhập link phòng họp trực tuyến...',
	'tuvan.form.capacity': 'Số sinh viên tối đa',
	'tuvan.form.note': 'Ghi chú',
	'tuvan.form.startAt': 'Bắt đầu',
	'tuvan.form.endAt': 'Kết thúc',
	'tuvan.form.endAtBeforeStart': 'Thời điểm kết thúc phải sau thời điểm bắt đầu',
	'tuvan.form.durationLabel': 'Thời lượng',
	'tuvan.form.minutesValue': '{value} phút',
	'tuvan.form.cardTitle': 'Ca #{index}',
	'tuvan.form.addSlot': 'Thêm ca',
	'tuvan.form.removeSlot': 'Xoá ca này',

	// Form tạo/sửa lịch tư vấn cho sinh viên (cố vấn tự đặt hộ)
	'tuvan.form.student': 'Sinh viên',
	'tuvan.form.onlyMyStudents': 'Chỉ SV tôi phụ trách',
	'tuvan.form.studentPlaceholder': 'Tìm theo mã số hoặc họ tên sinh viên...',
	'tuvan.form.studentEmpty': 'Không tìm thấy sinh viên nào bạn đang phụ trách',
	'tuvan.form.slot': 'Ca tư vấn',
	'tuvan.form.slotPlaceholder': 'Chọn 1 ca tư vấn còn trống của bạn...',
	'tuvan.form.slotEmpty': 'Bạn chưa có ca tư vấn nào còn trống — hãy tạo ca ở trang Khả dụng trước',
	'tuvan.form.slotRemaining': 'Còn {value}/{total} chỗ',
	'tuvan.form.advisingType': 'Loại tư vấn',
	'tuvan.form.topic': 'Nội dung tư vấn',
	'tuvan.form.topicPlaceholder': 'Nhập nội dung/mục đích buổi tư vấn...',
	'tuvan.createBooking.success': 'Đã tạo lịch tư vấn',
	'tuvan.updateBooking.success': 'Đã cập nhật lịch tư vấn',

	// Modal huỷ ca
	'tuvan.cancelSlot.title': 'Huỷ ca tư vấn này',
	'tuvan.cancelSlot.description':
		'Mọi yêu cầu đặt lịch đang được xác nhận cho ca này sẽ tự động bị huỷ theo. Vui lòng nêu rõ lý do.',
	'tuvan.cancelSlot.reasonLabel': 'Lý do huỷ',
	'tuvan.cancelSlot.reasonPlaceholder': 'Nhập lý do huỷ ca tư vấn này...',
	'tuvan.cancelSlot.confirm': 'Xác nhận huỷ',
	'tuvan.cancelSlot.success': 'Đã huỷ ca tư vấn',

	// Modal huỷ 1 lịch tư vấn đã đặt
	'tuvan.cancelBooking.title': 'Huỷ lịch tư vấn này',
	'tuvan.cancelBooking.description': 'Huỷ lịch tư vấn với sinh viên {name}. Vui lòng nêu rõ lý do.',
	'tuvan.cancelBooking.reasonLabel': 'Lý do huỷ',
	'tuvan.cancelBooking.reasonPlaceholder': 'Nhập lý do huỷ lịch tư vấn này...',
	'tuvan.cancelBooking.confirm': 'Xác nhận huỷ',
	'tuvan.cancelBooking.success': 'Đã huỷ lịch tư vấn',

	// Màn chi tiết yêu cầu đặt lịch
	'tuvan.detail.studentName': 'Họ và tên sinh viên',
	'tuvan.detail.studentId': 'Mã sinh viên',
	'tuvan.detail.advisingType': 'Loại tư vấn',
	'tuvan.detail.topic': 'Nội dung sinh viên muốn tư vấn',
	'tuvan.detail.cancelInfo': 'Thông tin huỷ',
	'tuvan.detail.cancelledBy': 'Người huỷ',
	'tuvan.detail.cancelReason': 'Lý do huỷ',
	'tuvan.detail.cancelledAt': 'Thời điểm huỷ',
	'tuvan.detail.resultInfo': 'Kết quả buổi tư vấn',
	'tuvan.detail.objective': 'Mục tiêu',
	'tuvan.detail.outcome': 'Kết quả',
	'tuvan.detail.nextStep': 'Bước tiếp theo',
	'tuvan.detail.readOnlyNote': 'Chỉ xem — hệ thống chưa hỗ trợ cố vấn duyệt/từ chối yêu cầu đặt lịch.',

	// Modal ghi nhận kết quả buổi tư vấn
	'tuvan.recordResult.title': 'Ghi nhận kết quả buổi tư vấn',
	'tuvan.recordResult.description': 'Ghi nhận kết quả buổi tư vấn với sinh viên {name}. Chỉ ghi được 1 lần.',
	'tuvan.recordResult.attendedLabel': 'Sinh viên có tham dự không?',
	'tuvan.recordResult.attendedYes': 'Có tham dự',
	'tuvan.recordResult.attendedNo': 'Vắng mặt',
	'tuvan.recordResult.success': 'Đã ghi nhận kết quả buổi tư vấn',
};
