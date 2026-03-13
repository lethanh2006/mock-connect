import { ETagColor, officialColors, statusBgColors, statusColors } from '../base/constant';

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
	[EApprovalStatus.CHANGES_REQUIRED]: 'Change Required',
	[EApprovalStatus.EXPIRED]: 'Expired',
};

export const mapColorApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.EVIDENCE_REQUIRED]: statusBgColors.statusBg300,
	[EApprovalStatus.DRAFT]: statusBgColors.statusBg300,
	[EApprovalStatus.SUBMITTED]: statusBgColors.statusBg200,
	[EApprovalStatus.APPROVED]: statusBgColors.statusBg100,
	[EApprovalStatus.REJECTED]: statusBgColors.statusBg400,
	[EApprovalStatus.CHANGES_REQUIRED]: statusBgColors.statusBg300,
	[EApprovalStatus.EXPIRED]: officialColors.official500,
};

export const mapColorTextApprovalStatus: Record<EApprovalStatus, string> = {
	[EApprovalStatus.EVIDENCE_REQUIRED]: statusColors.status300,
	[EApprovalStatus.DRAFT]: statusColors.status300,
	[EApprovalStatus.SUBMITTED]: statusColors.status200,
	[EApprovalStatus.APPROVED]: statusColors.status100,
	[EApprovalStatus.REJECTED]: statusColors.status400,
	[EApprovalStatus.CHANGES_REQUIRED]: statusColors.status300,
	[EApprovalStatus.EXPIRED]: officialColors.official300,
};

export enum EActivityCategory {
	REGISTERED = 'REGISTERED',
	PERSONAL_CO_CURRICULAR = 'PERSONAL_CO_CURRICULAR',
}

export const mapNameActivityCategory: Record<EActivityCategory, string> = {
	[EActivityCategory.REGISTERED]: 'Registered Activity',
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
