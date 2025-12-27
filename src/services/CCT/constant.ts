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
	[EApprovalStatus.SUBMITTED]: 'Submitted',
	[EApprovalStatus.APPROVED]: 'Approved',
	[EApprovalStatus.REJECTED]: 'Rejected',
	[EApprovalStatus.CHANGES_REQUIRED]: 'Changes Required',
};

export const mapColorApprovalStatus: Record<EApprovalStatus, ETagColor> = {
	[EApprovalStatus.DRAFT]: ETagColor.DEFAULT,
	[EApprovalStatus.SUBMITTED]: ETagColor.GOLD,
	[EApprovalStatus.APPROVED]: ETagColor.GREEN,
	[EApprovalStatus.REJECTED]: ETagColor.RED,
	[EApprovalStatus.CHANGES_REQUIRED]: ETagColor.ORANGE,
};

export enum EActivityCategory {
	REGISTERED = 'REGISTERED',
	PERSONAL_CO_CURRICULAR = 'PERSONAL_CO_CURRICULAR',
}

export const mapNameActivityCategory: Record<EActivityCategory, string> = {
	[EActivityCategory.REGISTERED]: 'Registered Activities',
	[EActivityCategory.PERSONAL_CO_CURRICULAR]: 'Personal Co-curricular Activity',
};
