import { Activity } from '../Activity/typing';
import { EActivityCategory, EApprovalStatus, Evalidation } from '../constant';

declare module ActivityOutCome {
	export interface IRecord {
		_id: string;
		activitiesOutcomeName: string;
		activitiesId: string;
		activities: Activity.IRecord;
		activitiesTypeId: string;
		activitiesType: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		levelsId: string;
		levels?: LevelsManagement.IRecord;
		organizer: string;
		description: string;
		location: string;
		learningOutcomes: string;
		file: string[] | null;
		answerId: string;
		selfAssessmentQuestionsId: string;
		workflow: EApprovalStatus;
		activityCategory: EActivityCategory;
		studentDeclarationApproverName: string;
		studentDeclarationApproverSsoId: string;
		activityRejectionNote: string;
		revisionNote: string;
		validation: Evalidation;
		reflection: string;

		activityRejectionNote?: string;
		listAchievedCompetencies: Activity.ICompetencyMapping[];
		evidenceFile: {
			name: string;
			file: string[];
		}[];
		competencyList: ICompetencyActivity[];

		supervisorSsoId: string;
		supervisorName: string;
		supervisorCode: string;

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IAnalyticsStudent {
		approved: number;
		changesRequired: number;
		draft: number;
		rejected: number;
		submitted: number;
		total: number;
	}

	export interface ICompetencyActivity {
		_id: string;
		competencyId: string;
		activitiesId: string;
		competency: Competency.IRecord;
		activities: IRecord;
	}
}
