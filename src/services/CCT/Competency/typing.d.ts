declare module Competency {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		attributesId: string;
		attributes: AttributesManagement.IRecord;
		order: number;
		description: string;
		isActive: boolean;
	}
}
