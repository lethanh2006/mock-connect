import { EApprovalStatus, EparticipantRole, EParticipantScope } from '../constant';

declare module Activity {
	export interface IRecord {
		_id: string;
		name: string;
		startDate: Date;
		endDate: Date;
		banner: string;
		backgroundImage: string;
		organizer: string;

		onCampus: boolean;
		facilityCode: string;
		facilityName: string;
		otherAddress: string;

		description: string;

		participantScope: EParticipantScope;
		participantsList: IParticipantsList[];
		participantRole: EparticipantRole;
		facultyCode: string;
		studentCohortCode: string;
		majorCode: string;
		courseClassCode: string;
		unitCode: string;

		allowPostEventResultsUpdate?: boolean;

		activitiesTypeId: string | null;
		activitiesType: ActivitiesManagement.IRecord;
		featuredActivities: boolean;

		studentDeclarationApproverList: ActivitiesManagement.IStudentDeclaration[];
		coCurricularActivityEquivalency: IEquivalency[];

		workflow: EApprovalStatus;

		//fake
		cct?: boolean;
	}

	export interface IParticipantsList {
		_id: string;
		index: number;
		ssoId: string;
		name: string;
		email: string;
		participantRole: EparticipantRole;
		activitiesId: string;
		activities: string;
	}

	export interface IEquivalency {
		_id: string;
		activitiesId: string;
		activities?: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		attributesId: string;
		attributes?: AttributesManagement.IRecord;
		autoApprove: boolean;
		selfAssessmentQuestionsId: string;
		selfAssessmentQuestionsName: string;
	}
}
