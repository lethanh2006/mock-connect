declare module ChatbotAmi {
	export interface IRecord {
		_id: string;
		content: string;
		isUser: boolean;
		sendFail?: boolean;

		urlVideo?: string;

		createdAt: string;
	}
}
