export const AdvisorChangeStatus = {
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
} as const;
export type AdvisorChangeStatus = (typeof AdvisorChangeStatus)[keyof typeof AdvisorChangeStatus];

export const ADVISOR_CHANGE_STATUS_LABEL_KEY: Record<AdvisorChangeStatus, string> = {
	PENDING: 'idp.advisorChange.status.PENDING',
	APPROVED: 'idp.advisorChange.status.APPROVED',
	REJECTED: 'idp.advisorChange.status.REJECTED',
};

export const EAdvisorType = {
	FACULTY_ADVISOR: 'FACULTY_ADVISOR',
	PEER_ADVISOR: 'PEER_ADVISOR',
	PROFESSIONAL_ADVISOR: 'PROFESSIONAL_ADVISOR',
} as const;
export type EAdvisorType = (typeof EAdvisorType)[keyof typeof EAdvisorType];

export const ADVISOR_TYPE_LABEL_KEY: Record<EAdvisorType, string> = {
	FACULTY_ADVISOR: 'idp.advisorChange.type.FACULTY_ADVISOR',
	PEER_ADVISOR: 'idp.advisorChange.type.PEER_ADVISOR',
	PROFESSIONAL_ADVISOR: 'idp.advisorChange.type.PROFESSIONAL_ADVISOR',
};

/** Chỉ 2 loại được gán tự động cho sinh viên; `PROFESSIONAL_ADVISOR` chưa hỗ trợ đổi ở màn này. */
export const ADVISOR_CHANGE_REQUEST_TYPES: EAdvisorType[] = [EAdvisorType.FACULTY_ADVISOR, EAdvisorType.PEER_ADVISOR];

/** Độ dài `reason` khi gửi yêu cầu đổi cố vấn. */
export const ADVISOR_CHANGE_REASON_MIN_LENGTH = 10;
export const ADVISOR_CHANGE_REASON_MAX_LENGTH = 2000;
