declare module ActivitiesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributesId: string;
		attributes: AttributesManagement.IRecord;
		order: number;
		description: string;
		isActive: boolean;
		studentDeclarationApproverList: IStudentDeclaration[];
	}

	export interface IStudentDeclaration {
		_id: string;
		index: number;
		ssoId: string;
		name: string;
		email: string;
		activitiesTypeId: string;
		activitiesType: string;
		activitiesId: string;
		activities: string;
	}
}
