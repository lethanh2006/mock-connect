import type { AdvisorChangeStatus, EAdvisorType } from './constant';

declare module AdvisorChange {
	export interface IMyAdvisor {
		id: string;
		studentSsoId: string;
		studentCode: string;
		studentName: string;
		email: string;
		metaData: Record<string, unknown>;
		maNganh: string;
		tenNganh: string | null;
		maVien?: string;
		tenVien?: string;
		advisorSsoId: string;
		advisorName: string;
		type: EAdvisorType;
		createdAt: string;
		updatedAt: string;
	}

	/** Item trả về từ `GET /advisor/majors/:maNganh` — dùng cho `SelectAdvisor`. */
	export interface IAdvisorOfMajor {
		advisorSsoId: string;
		advisorName: string;
		totalStudents?: number;
	}

	export interface ICreateRequest {
		type: EAdvisorType;
		reason: string;
		toAdvisorSsoId?: string;
		toAdvisorName?: string;
		supportingDocuments?: string[];
	}

	export interface IRecord {
		id: string;
		idpId: string;
		type: EAdvisorType;
		studentCode: string;
		studentName: string;
		maNganh: string | null;
		tenNganh: string | null;
		fromAdvisorSsoId: string | null;
		fromAdvisorName: string;
		reason: string;
		supportingDocuments: string[];
		status: AdvisorChangeStatus;
		toAdvisorSsoId: string | null;
		toAdvisorName: string | null;
		reviewComment: string | null;
		reviewedAt: string | null;
		reviewerName: string | null;
		createdAt: string;
	}
}
