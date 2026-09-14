import type { IdpReviewStatus, IdpStatus } from './constant';

declare module IdpCoVan {
	export interface IActionItem {
		action: string;
		smartOutcome: string;
		timelineAndSupport: string;
		progressCheckpoint: string | null;
	}

	export interface IContent {
		// PART A — PURPOSE OF LIFE (IKIGAI)
		whatILove: string;
		whatIAmGoodAt: string;
		whatTheWorldNeeds: string;
		whatICanBePaidFor: string;

		// PART B — INDIVIDUAL DEVELOPMENT PLAN
		shortTermGoals: string;
		longTermGoals: string;
		strengths: string;
		areasForImprovement: string;

		actionPlan: IActionItem[];
	}

	export interface IIdp {
		_id: string;
		studentSsoId: string;
		status: IdpStatus;
		content: IContent;
		reviewComment: string | null;
		reviewedAt: string | null;
		reviewerSsoId: string | null;
		reviewerName: string | null;
		isEffective?: boolean;
		createdAt: string;
		updatedAt: string;
	}

	/** Trả về từ `GET /idp/page` — kèm thông tin sinh viên + cố vấn hiện tại. */
	export interface IIdpListItem extends IIdp {
		studentCode: string | null;
		studentName: string | null;
		program: string | null;
		advisorName: string | null;
	}

	/** Trả về từ `GET /advisor/me/students/page`. */
	export interface IStudentSummary {
		studentSsoId: string;
		studentCode: string;
		studentName: string;
		studentEmail?: string;
		studentPhone?: string;
		studentAddress?: string;
		bookingCount?: number;
		hasIdp?: boolean;
		maNganh: string;
		tenNganh: string;
		assignedAt: string;
	}

	export interface IReviewPayload {
		status: IdpReviewStatus;
		comment?: string;
	}

	/** Trả về từ `GET /advisor/me/stats`. */
	export interface IAdvisorStats {
		totalStudents: number;
		studentsWithIdp: number;
		studentsWithoutIdp: number;
		studentsWithBooking: number;
		studentsWithoutBooking: number;
	}
}
