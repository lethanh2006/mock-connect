import { ETagColor } from '../base/constant';

export enum EParticipantScope {
	UNIVERSITY = 'University',
	USER_LIST = 'UserList',
	STUDENT = 'StudentCohort',
	MAJOR = 'Major',
	COURSE_CLASS = 'CourseClass',
	UNIT = 'Unit',
}

export enum EparticipantRole {
	STUDENT = 'Student',
	STAFF = 'Staff',
	ALL = 'All',
}

export const mapNameParticipantScope: Record<EParticipantScope, string> = {
	[EParticipantScope.UNIVERSITY]: 'University',
	[EParticipantScope.USER_LIST]: 'User List',
	[EParticipantScope.STUDENT]: 'Student Cohort',
	[EParticipantScope.MAJOR]: 'Major',
	[EParticipantScope.COURSE_CLASS]: 'Course Class',
	[EParticipantScope.UNIT]: 'Unit',
};

export const mapNameParticipantRole: Record<EparticipantRole, string> = {
	[EparticipantRole.STUDENT]: 'Student',
	[EparticipantRole.STAFF]: 'Staff',
	[EparticipantRole.ALL]: 'All',
};

export enum EApprovalStatus {
	DRAFT = 'DRAFT', // Trạng thái ban đầu (chưa gửi / chưa upload)
	SUBMITTED = 'SUBMITTED', // Đã upload evidence, chờ duyệt
	APPROVED = 'APPROVED', // Đã duyệt
	REJECTED = 'REJECTED', // Bị từ chối
	CHANGES_REQUIRED = 'CHANGES_REQUIRED', // Yêu cầu chỉnh sửa
}

export const mapNameApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.DRAFT]: 'Draft',
	[EApprovalStatus.SUBMITTED]: 'Pending For Approval',
	[EApprovalStatus.APPROVED]: 'Approved',
	[EApprovalStatus.REJECTED]: 'Rejected',
	[EApprovalStatus.CHANGES_REQUIRED]: 'Changes Required',
};

export const mapColorApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.DRAFT]: '#CE7C1E',
	[EApprovalStatus.SUBMITTED]: '#0E50CF',
	[EApprovalStatus.APPROVED]: '#329323',
	[EApprovalStatus.REJECTED]: '#C80F1F',
	[EApprovalStatus.CHANGES_REQUIRED]: '#CE7C1E',
};

export enum EActivityCategory {
	REGISTERED = 'REGISTERED',
	PERSONAL_CO_CURRICULAR = 'PERSONAL_CO_CURRICULAR',
}

export const mapNameActivityCategory: Record<EActivityCategory, string> = {
	[EActivityCategory.REGISTERED]: 'Registered Activities',
	[EActivityCategory.PERSONAL_CO_CURRICULAR]: 'Personal Co-curricular Activity',
};

export enum Evalidation {
	VERIFIED = 'Verified',
	ENDORSED = 'Endorsed',
	FEATURED = 'Featured',
}

export const mapEvalidation: Record<Evalidation, ETagColor> = {
	[Evalidation.VERIFIED]: ETagColor.BLUE,
	[Evalidation.ENDORSED]: ETagColor.GOLD,
	[Evalidation.FEATURED]: ETagColor.GREEN,
};
