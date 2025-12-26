declare module AttributesManagement {
	export interface IRecord {
		_id: string;
		code: string;
		name: string;
		order: number;
		description: string;
		isActive: boolean;
		icon: string;
		color: string;
		background: string;
	}
}
