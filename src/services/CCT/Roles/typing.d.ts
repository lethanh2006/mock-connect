declare module RolesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		levelsId: string;
		level: LevelsManagement.IRecord;
		order: number;
		description: string;
		isActive: boolean;
		autoApproval: boolean;
	}
}
