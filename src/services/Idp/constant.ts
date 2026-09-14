import type { Idp } from './typing';

export const IdpStatus = {
	DRAFT: 'DRAFT',
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
	REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const;
export type IdpStatus = (typeof IdpStatus)[keyof typeof IdpStatus];

/** Key i18n của nhãn trạng thái — dùng `intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[status] })`. */
export const IDP_STATUS_LABEL_KEY: Record<IdpStatus, string> = {
	DRAFT: 'idp.status.DRAFT',
	PENDING: 'idp.status.PENDING',
	APPROVED: 'idp.status.APPROVED',
	REJECTED: 'idp.status.REJECTED',
	REVISION_REQUESTED: 'idp.status.REVISION_REQUESTED',
};

/** Độ dài tối đa cho mỗi ô nội dung tự do của PART A. */
export const IDP_PART_A_MAX_LENGTH = 220;
/** Độ dài tối đa cho mỗi ô nội dung tự do của PART B. */
export const IDP_PART_B_MAX_LENGTH = 500;

/** Nhóm field của PART A — MỤC ĐÍCH SỐNG (IKIGAI), dùng để validate theo từng bước và hiển thị ở khối review. */
export const IDP_PART_A_FIELDS: (keyof Idp.IFormRequest)[] = [
	'whatILove',
	'whatIAmGoodAt',
	'whatTheWorldNeeds',
	'whatICanBePaidFor',
];

/** Nhóm field của PART B — KẾ HOẠCH PHÁT TRIỂN CÁ NHÂN, dùng để validate theo từng bước và hiển thị ở khối review. */
export const IDP_PART_B_FIELDS: (keyof Idp.IFormRequest)[] = [
	'shortTermGoals',
	'longTermGoals',
	'strengths',
	'areasForImprovement',
];

/** Số dòng hành động (SMART) tối thiểu/tối đa trong 1 bản IDP. */
export const IDP_ACTION_PLAN_MIN_ITEMS = 1;
export const IDP_ACTION_PLAN_MAX_ITEMS = 10;

/** Độ dài tối đa cho từng cột của bảng Kế hoạch hành động (SMART). */
export const IDP_ACTION_MAX_LENGTH = 200;
export const IDP_SMART_OUTCOME_MAX_LENGTH = 500;
export const IDP_TIMELINE_AND_SUPPORT_MAX_LENGTH = 500;
