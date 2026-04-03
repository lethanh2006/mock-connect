declare module MyCCT {
	export interface IRecord {
		_id: string;
		approvedAt: string;
		approvedBy: string;
		approvedByName: string;
		approvedByUsername: string;
		avatar: string;
		code: string;
		dataPartitionCode: string;
		dateOfIssue: string;
		dob: string;
		name: string;
		revisionNote: string;
		selfAspiration: string;
		serialNumber: string;
		ssoId: string;
		status: string;
		submissionRoundId: string;
		yearOfEnrollment: string;
		program: string;
		concentration: string;
		listCompetency: string[];
		listAwardRecognition: string[];
		college: string;
		awardsAndRecognition: {
			name: string;
			description: string;
			date: string;
			evidenceFile: {
				name: string;
				file: string[];
			}[];
		}[];
		selectedActivities: {
			attributeId: string;
			activityIds: string[];
		}[];

		submittedAt: string;
		updatedAt: Date;
		createdAt: Date;
	}

	export interface IAttributeMyCCT {
		activitiesOutCome: IActivityOutComeMyCCT[];
		attribute: AttributesManagement.IRecord;
		countLevel: {
			Contributor: number;
			'Impact Driver': number;
			Leader: number;
			Participant: number;
		};
		listCompetencies: string[];
	}

	export interface ILevelOfEngagement {
		count: number;
		level: LevelsManagement.IRecord;
		percentage: null;
	}

	export interface IActivityOutComeMyCCT {
		id: string;
		activity: string;
		impact: string;
		level: string;
		organizationUnit: string;
		role: string;
		_levelOrderForSorting: number;
		startDate: Date;
		endDate: Date;
	}
}
