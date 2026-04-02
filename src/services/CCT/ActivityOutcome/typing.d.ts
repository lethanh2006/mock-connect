import { Activity } from '../Activity/typing';
import { EActivityCategory, EApprovalStatus, EScopeAward, Evalidation } from '../constant';

declare module ActivityOutCome {
	export interface IRecord {
		_id: string;
		banner: string | null;
		activitiesOutcomeName: string;
		activitiesId: string;
		activities: Activity.IRecord;
		activitiesTypeId: string;
		activitiesType: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		levelsId: string;
		levels?: LevelsManagement.IRecord;
		trackId?: string;
		track?: TrackManagement.IRecord;
		trackText: string;
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
		startDate: Date;
		endDate: Date;
		dueDate: Date;
		submittedAt?: Date;
		approvalTime?: Date;

		activityRejectionNote?: string;
		listAchievedCompetencies: Activity.ICompetencyMapping[];
		evidenceFile: {
			name: string;
			file: string[];
		}[];

		supervisorSsoId: string;
		supervisorName: string;
		supervisorCode: string;

		createdAt: Date;
		updatedAt: Date;

		//Award
		isAwardRecognition: boolean;
		competition: string;
		dateOfAchievement: Date;
		scope: EScopeAward;
		rank: string;
		link: string;
	}

	export interface IAnalyticsStudent {
		actionRequired: number;
		approved: number;
		expired: number;
		pendingForApproval: number;
		rejected: number;
		total: number;
	}

	export interface ICompetencyActivity {
		_id: string;
		competencyId: string;
		activitiesId: string;
		competency: Competency.IRecord;
		activities: IRecord;
	}

	export interface IThongKeLevels {
		_id: string;
		code: string;
		name: string;
		order: number;
		count: number;
		percentage: number;
	}

	export interface IThongKeAttributes {
		_id: string;
		code: string;
		name: string;
		icon: string;
		color: string;
		count: number;
		percentage: number;
	}

	export interface IThongKeActivityType {
		_id: string;
		code: string;
		name: string;
		count: number;
		percentage: number;
	}
}
