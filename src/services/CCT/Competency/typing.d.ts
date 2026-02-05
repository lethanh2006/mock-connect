declare module Competency {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributes: AttributesManagement.IRecord[];
		order: number;
		description: string;
		isActive: boolean;
		competencyAttributesList: ICompetencyAttributes[];
		evidenceLExampleList: string[];
		typicalActivityList: string[];
	}

	export interface ICompetencyAttributes {
		_id: string;
		index: number;
		competencyId: string;
		competency: IRecord;
		attributesId: string;
		attributes: Attributes.IAttributes;
	}
}
