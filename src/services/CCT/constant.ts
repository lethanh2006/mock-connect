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
	EVIDENCE_REQUIRED = 'EVIDENCE_REQUIRED',
	DRAFT = 'DRAFT',
	SUBMITTED = 'SUBMITTED',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	CHANGES_REQUIRED = 'CHANGES_REQUIRED',
	EXPIRED = 'EXPIRED',
}

export const mapNameApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.EVIDENCE_REQUIRED]: 'Evidence Required',
	[EApprovalStatus.DRAFT]: 'Draft',
	[EApprovalStatus.SUBMITTED]: 'Pending For Approval',
	[EApprovalStatus.APPROVED]: 'Approved',
	[EApprovalStatus.REJECTED]: 'Rejected',
	[EApprovalStatus.CHANGES_REQUIRED]: 'Changes Required',
	[EApprovalStatus.EXPIRED]: 'Expired',
};

export const mapColorApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.EVIDENCE_REQUIRED]: '#FFFAE4',
	[EApprovalStatus.DRAFT]: '#FFFAE4',
	[EApprovalStatus.SUBMITTED]: '#E2F2FE',
	[EApprovalStatus.APPROVED]: '#F5FFEB',
	[EApprovalStatus.REJECTED]: '#FFEFEE',
	[EApprovalStatus.CHANGES_REQUIRED]: '#FFFAE4',
	[EApprovalStatus.EXPIRED]: '#F4F9FF',
};

export const mapColorTextApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.EVIDENCE_REQUIRED]: '#CE7C1E',
	[EApprovalStatus.DRAFT]: '#CE7C1E',
	[EApprovalStatus.SUBMITTED]: '#0E50CF',
	[EApprovalStatus.APPROVED]: '#329323',
	[EApprovalStatus.REJECTED]: '#C80F1F',
	[EApprovalStatus.CHANGES_REQUIRED]: '#CE7C1E',
	[EApprovalStatus.EXPIRED]: '#134D8B',
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
