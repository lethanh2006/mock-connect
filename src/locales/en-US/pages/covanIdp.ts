export default {
	'idpcovan.title': 'Student IDP',
	'idpcovan.studentsPage.title': 'My advisees',

	// IDP list tabs
	'idpcovan.tab.all': 'All',
	'idpcovan.tab.approved': 'Currently effective',

	// Statistics cards
	'idpcovan.stat.totalStudents': 'Total students',
	'idpcovan.stat.studentsWithIdp': 'Has IDP',
	'idpcovan.stat.studentsWithoutIdp': 'No IDP',
	'idpcovan.stat.studentsWithBooking': 'Has booking',
	'idpcovan.stat.studentsWithoutBooking': 'No booking',

	// Status of an IDP entry
	'idpcovan.status.DRAFT': 'Draft',
	'idpcovan.status.PENDING': 'Pending',
	'idpcovan.status.APPROVED': 'Approved',
	'idpcovan.status.REJECTED': 'Rejected',
	'idpcovan.status.REVISION_REQUESTED': 'Revision requested',

	// "Effective" column — which IDP version is currently applied for the student
	'idpcovan.column.isEffective': 'Effective',
	'idpcovan.effective.yes': 'Currently effective',
	'idpcovan.effective.no': 'Not effective',

	// Student list
	'idpcovan.column.studentCode': 'Student ID',
	'idpcovan.column.studentName': 'Full name',
	'idpcovan.column.studentEmail': 'Email',
	'idpcovan.column.studentPhone': 'Phone',
	'idpcovan.column.studentAddress': 'Address',
	'idpcovan.column.bookingCounts': 'Bookings',
	'idpcovan.column.studentsWithIdp': 'Has IDP',
	'idpcovan.common.yes': 'Yes',
	'idpcovan.common.no': 'No',
	'idpcovan.column.maNganh': 'Major',
	'idpcovan.column.assignedAt': 'Assigned at',
	'idpcovan.column.action': 'Actions',
	'idpcovan.tooltip.review': 'Review IDP',
	'idpcovan.tooltip.viewDetail': 'View details',
	'idpcovan.tooltip.export': 'Export PDF',

	// List of a student's IDP entries
	'idpcovan.column.createdAt': 'Created at',
	'idpcovan.column.status': 'Status',
	'idpcovan.column.reviewedAt': 'Reviewed at',
	'idpcovan.column.reviewComment': "Advisor's comment",

	// Modals
	'idpcovan.modal.studentTitle': 'IDP of {name} ({code})',
	'idpcovan.modal.idpTitle': 'IDP content',

	// Student detail screen
	'idpcovan.detail.title': 'INDIVIDUAL DEVELOPMENT PLAN',
	'idpcovan.detail.studentName': 'Student name',
	'idpcovan.detail.studentId': 'Student ID',
	'idpcovan.detail.program': 'Program',
	'idpcovan.detail.pendingAlert': 'This student has an IDP waiting for your review — open it to read and decide.',
	'idpcovan.detail.idpListTitle': 'Submitted IDPs',
	'idpcovan.detail.noVersion': 'This student has not submitted an IDP yet',
	'idpcovan.detail.endorsedBy': 'Endorsed by Faculty Advisor: {name}',

	// IDP content
	'idpcovan.form.step.partA': 'PART A — PURPOSE OF LIFE (IKIGAI)',
	'idpcovan.form.step.partB': 'PART B — INDIVIDUAL DEVELOPMENT PLAN',
	'idpcovan.form.step.actionPlan': 'MY ACTION PLAN (SMART)',
	'idpcovan.form.label.whatILove': 'What I Love',
	'idpcovan.form.label.whatIAmGoodAt': "What I'm Good At",
	'idpcovan.form.label.whatTheWorldNeeds': 'What the World Needs',
	'idpcovan.form.label.whatICanBePaidFor': 'What I Can Be Paid For',
	'idpcovan.form.label.shortTermGoals': 'Short-term Goals (6 months – 1 year)',
	'idpcovan.form.label.longTermGoals': 'Long-term Goals (2 – 5 years)',
	'idpcovan.form.label.strengths': 'Strengths',
	'idpcovan.form.label.areasForImprovement': 'Areas for Improvement',

	// ACTION PLAN table
	'idpcovan.actionPlan.column.actions': 'ACTIONS',
	'idpcovan.actionPlan.column.smartOutcomes': 'SMART OUTCOMES',
	'idpcovan.actionPlan.column.timeline': 'TIMELINE & SUPPORT',
	'idpcovan.actionPlan.column.checkpoints': 'CHECKPOINTS',

	// PDF template (IdpExportTemplate)
	'idpcovan.pdf.partATitle': 'PURPOSE OF LIFE (IKIGAI)',
	'idpcovan.pdf.partBTitle': 'INDIVIDUAL DEVELOPMENT PLAN',
	'idpcovan.pdf.ikigaiHint':
		'Use the IKIGAI concept to reflect on your purpose by answering the four questions below:',
	'idpcovan.pdf.ikigaiIntersection': 'Purpose at the Intersection',

	// Three decision buttons
	'idpcovan.review.button.APPROVED': 'Approve',
	'idpcovan.review.button.REVISION_REQUESTED': 'Request revision',
	'idpcovan.review.button.REJECTED': 'Reject',

	// Decision modal
	'idpcovan.review.modalTitle.APPROVED': 'Approve this IDP',
	'idpcovan.review.modalTitle.REVISION_REQUESTED': 'Request revision of this IDP',
	'idpcovan.review.modalTitle.REJECTED': 'Reject this IDP',
	'idpcovan.review.modalDescription.APPROVED': 'This IDP of {name} will be approved and take effect.',
	'idpcovan.review.modalDescription.REVISION_REQUESTED':
		'This IDP will be sent back so {name} can revise and resubmit it.',
	'idpcovan.review.modalDescription.REJECTED': 'This IDP of {name} will be rejected.',
	'idpcovan.review.commentLabel.APPROVED': "Advisor's comment (optional)",
	'idpcovan.review.commentLabel.REVISION_REQUESTED': 'What needs to be revised',
	'idpcovan.review.commentLabel.REJECTED': 'Reason for rejection',
	'idpcovan.review.commentPlaceholder.APPROVED': 'Write a comment for the student...',
	'idpcovan.review.commentPlaceholder.REVISION_REQUESTED': 'Explain exactly what the student needs to change...',
	'idpcovan.review.commentPlaceholder.REJECTED': 'Explain why this IDP is rejected...',
	'idpcovan.review.success.APPROVED': 'IDP approved',
	'idpcovan.review.success.REVISION_REQUESTED': 'Revision requested',
	'idpcovan.review.success.REJECTED': 'IDP rejected',
};
