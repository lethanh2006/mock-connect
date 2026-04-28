declare module SubmisstionRound {
	export interface IRecord {
		_id: string;
		roundName: string;
		startDate: Date;
		endDate: Date;
		semesterCode: string;
		semesterName: string;
		note: string;
	}
}
