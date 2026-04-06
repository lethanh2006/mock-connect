declare module ActivitiesTypeDomain {
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
		activitiesTypeDomainId: string;
		activitiesTypeDomain: IRecord;
		activitiesId: string;
		activities: string;
	}
}
