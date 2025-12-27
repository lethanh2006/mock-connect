declare module RolesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		levelId: string;
		level: LevelsManagement.IRecord;
		order: number;
		description: string;
		isActive: boolean;
	}
}
