declare module Track {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		order: number;
		description: string;
		isActive: boolean;
	}
}
