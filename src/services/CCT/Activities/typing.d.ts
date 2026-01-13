declare module ActivitiesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributesId: string;
		attributes: AttributesManagement.IRecord;
		activitiesTypeDomainId: string;
		activitiesTypeDomain: ActivitiesTypeDomain.IRecord;
		order: number;
		description: string;
		isActive: boolean;
	}
}
