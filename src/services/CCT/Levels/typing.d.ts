declare module LevelsManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		order: number;
		description: string;
		isActive: boolean;
		autoApproval: boolean;
		selfAssessmentQuestionsId: string;
		selfAssessmentQuestionsName: string;
	}
}
