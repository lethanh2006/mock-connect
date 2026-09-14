export default {
	'tuvan.khadung.title': 'Consultation availability',
	'tuvan.khadung.modalTitle': 'Advising slot',
	'tuvan.yeucau.title': 'Consultation booking requests',

	// Statistics cards
	'tuvan.stat.total': 'Total bookings',
	'tuvan.stat.confirmed': 'Confirmed',
	'tuvan.stat.completed': 'Completed',
	'tuvan.stat.noShow': 'No-show',
	'tuvan.stat.cancelled': 'Cancelled',
	'tuvan.yeucau.modalTitle': 'Booking request of {name} ({code})',
	'tuvan.yeucau.form.createTitle': 'Create a new advising booking',
	'tuvan.yeucau.form.editTitle': 'Edit booking of {name} ({code})',

	// Advisor type
	'tuvan.advisorType.FACULTY_ADVISOR': 'Faculty advisor',
	'tuvan.advisorType.PEER_ADVISOR': 'Peer advisor',
	'tuvan.advisorType.PROFESSIONAL_ADVISOR': 'Professional advisor',

	// Advising mode
	'tuvan.mode.OFFLINE': 'Offline',
	'tuvan.mode.ONLINE': 'Online',

	// Advising type (chosen by the student when booking)
	'tuvan.type.ACADEMIC': 'Academic',
	'tuvan.type.NON_ACADEMIC': 'Non-academic',

	// Slot status
	'tuvan.slotStatus.OPEN': 'Open',
	'tuvan.slotStatus.FULL': 'Full',
	'tuvan.slotStatus.CANCELLED': 'Cancelled',

	// Booking status
	'tuvan.bookingStatus.CONFIRMED': 'Confirmed',
	'tuvan.bookingStatus.CANCELLED': 'Cancelled',
	'tuvan.bookingStatus.COMPLETED': 'Completed',
	'tuvan.bookingStatus.NO_SHOW': 'No-show',

	// Who cancelled the booking
	'tuvan.cancelledBy.STUDENT': 'Student',
	'tuvan.cancelledBy.ADVISOR': 'Advisor',
	'tuvan.cancelledBy.SAM': 'System',

	// Table columns — shared by both screens
	'tuvan.column.action': 'Actions',
	'tuvan.column.date': 'Date',
	'tuvan.column.time': 'Time',
	'tuvan.column.mode': 'Mode',
	'tuvan.column.locationOrLink': 'Location / Link',
	'tuvan.column.booked': 'Booked',
	'tuvan.column.slotStatus': 'Status',
	'tuvan.column.bookingStatus': 'Status',
	'tuvan.column.studentCode': 'Student ID',
	'tuvan.column.studentName': 'Full name',
	'tuvan.column.studentEmail': 'Email',
	'tuvan.column.studentPhone': 'Phone',
	'tuvan.column.studentAddress': 'Address',
	'tuvan.column.createdAt': 'Booked at',

	'tuvan.tooltip.edit': 'Edit slot',
	'tuvan.tooltip.cancel': 'Cancel slot',
	'tuvan.tooltip.delete': 'Delete slot',
	'tuvan.tooltip.slotCancelledHint': 'This slot is cancelled',
	'tuvan.tooltip.slotHasBookingsHint': 'This slot already has bookings — use Cancel instead',
	'tuvan.tooltip.viewDetail': 'View details',
	'tuvan.tooltip.editBooking': 'Edit booking',
	'tuvan.tooltip.editBookingDisabledHint': 'Can only edit while the booking is Confirmed',
	'tuvan.tooltip.cancelBooking': 'Cancel booking',
	'tuvan.tooltip.cancelBookingDisabledHint': 'Can only cancel while the booking is Confirmed',
	'tuvan.tooltip.recordResult': 'Record session result',
	'tuvan.tooltip.resultAlreadyRecordedHint': 'The result for this session was already recorded',
	'tuvan.tooltip.resultNotConfirmedHint': 'Can only record a result while the booking is Confirmed',
	'tuvan.tooltip.resultTooEarlyHint': "It's not time for the appointment yet",
	'tuvan.tooltip.overdueUnresolved': 'The appointment time has passed but the session result was never recorded',
	'tuvan.confirm.deleteSlot': 'Are you sure you want to delete this slot?',

	// Slot form
	'tuvan.form.mode': 'Advising mode',
	'tuvan.form.locationOffline': 'Location',
	'tuvan.form.locationOfflinePlaceholder': 'Enter the in-person location...',
	'tuvan.form.locationOnline': 'Meeting link',
	'tuvan.form.locationOnlinePlaceholder': 'Enter the online meeting link...',
	'tuvan.form.capacity': 'Max students',
	'tuvan.form.note': 'Note',
	'tuvan.form.startAt': 'Start',
	'tuvan.form.endAt': 'End',
	'tuvan.form.endAtBeforeStart': 'End time must be after the start time',
	'tuvan.form.durationLabel': 'Duration',
	'tuvan.form.minutesValue': '{value} min',
	'tuvan.form.cardTitle': 'Slot #{index}',
	'tuvan.form.addSlot': 'Add slot',
	'tuvan.form.removeSlot': 'Remove this slot',

	// Create/edit an advising booking for a student (advisor books on their behalf)
	'tuvan.form.student': 'Student',
	'tuvan.form.onlyMyStudents': 'My advisees only',
	'tuvan.form.studentPlaceholder': 'Search by student ID or name...',
	'tuvan.form.studentEmpty': 'No advisees found',
	'tuvan.form.slot': 'Advising slot',
	'tuvan.form.slotPlaceholder': 'Choose one of your open slots...',
	'tuvan.form.slotEmpty': "You don't have any open slots — create one on the Availability page first",
	'tuvan.form.slotRemaining': '{value}/{total} left',
	'tuvan.form.advisingType': 'Advising type',
	'tuvan.form.topic': 'Topic',
	'tuvan.form.topicPlaceholder': 'Enter the topic/purpose of this session...',
	'tuvan.createBooking.success': 'Booking created',
	'tuvan.updateBooking.success': 'Booking updated',

	// Cancel slot modal
	'tuvan.cancelSlot.title': 'Cancel this advising slot',
	'tuvan.cancelSlot.description':
		'Any booking currently confirmed for this slot will be cancelled automatically. Please state the reason.',
	'tuvan.cancelSlot.reasonLabel': 'Reason',
	'tuvan.cancelSlot.reasonPlaceholder': 'Explain why this slot is being cancelled...',
	'tuvan.cancelSlot.confirm': 'Confirm cancel',
	'tuvan.cancelSlot.success': 'Slot cancelled',

	// Cancel booking modal
	'tuvan.cancelBooking.title': 'Cancel this booking',
	'tuvan.cancelBooking.description': 'Cancel the booking with {name}. Please state the reason.',
	'tuvan.cancelBooking.reasonLabel': 'Reason',
	'tuvan.cancelBooking.reasonPlaceholder': 'Explain why this booking is being cancelled...',
	'tuvan.cancelBooking.confirm': 'Confirm cancel',
	'tuvan.cancelBooking.success': 'Booking cancelled',

	// Booking detail screen
	'tuvan.detail.studentName': 'Student name',
	'tuvan.detail.studentId': 'Student ID',
	'tuvan.detail.advisingType': 'Advising type',
	'tuvan.detail.topic': 'What the student wants to discuss',
	'tuvan.detail.cancelInfo': 'Cancellation',
	'tuvan.detail.cancelledBy': 'Cancelled by',
	'tuvan.detail.cancelReason': 'Reason',
	'tuvan.detail.cancelledAt': 'Cancelled at',
	'tuvan.detail.resultInfo': 'Session result',
	'tuvan.detail.objective': 'Objective',
	'tuvan.detail.outcome': 'Outcome',
	'tuvan.detail.nextStep': 'Next step',
	'tuvan.detail.readOnlyNote': "View only — the backend doesn't support advisor approval/rejection of bookings yet.",

	// Record session result modal
	'tuvan.recordResult.title': 'Record session result',
	'tuvan.recordResult.description': 'Record the result of the session with {name}. This can only be done once.',
	'tuvan.recordResult.attendedLabel': 'Did the student attend?',
	'tuvan.recordResult.attendedYes': 'Attended',
	'tuvan.recordResult.attendedNo': 'No-show',
	'tuvan.recordResult.success': 'Session result recorded',
};
