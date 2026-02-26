declare module ActivitiesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributesId: string;
		attributes: AttributesManagement.IRecord[];
		activitiesTypeDomainId: string;
		activitiesTypeDomain: ActivitiesTypeDomain.IRecord;
		activitiesTypeDomainText?: string;
		order: number;
		description: string;
		isActive: boolean;

		coCurricularAttributesEquivalency?: any[];
		requiredEvidenceList?: string[];
		track: ITrack;
		trackId: string;
		trackText: string;
	}

	export interface ITrack {
		_id: string;
		code: string;
		name: string;
		order: number;
		description: string;
		isActive: boolean;
	}
}
