import type { IdpStatus } from './constant';

declare module Idp {
	export interface IActionItem {
		action: string;
		smartOutcome: string;
		timelineAndSupport: string;
		progressCheckpoint: string | null;
	}

	export interface IFormRequest {
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

	export interface IRecord {
		_id: string;
		studentSsoId: string;

		status: IdpStatus;
		content: IFormRequest;
		reviewComment: string | null;
		reviewedAt: string | null;
		reviewerSsoId: string | null;
		reviewerName: string | null;
		createdAt: string;
		updatedAt: string;
	}

	export interface ISummary {
		effectiveId: string | null;
		effectiveApprovedAt: string | null;
		latestId: string | null;
		latestStatus: IdpStatus | null;
		latestComment: string | null;
	}
}
