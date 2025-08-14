import type { ERolesUsers } from './constant';

declare module ChatbotAmiV2 {
	export interface ISourceItem {
		source: any;
		content: string;
	}

	export interface IRecord {
		_id: string;
		content: string;
		isUser: boolean;
		createdAt: string;
		urlVideo?: string;
		sendFail?: boolean;

		recommendQuestions?: string[];
		sources?: ISourceItem[];
	}

	export interface IUser {
		id: number;
		password: string;
		dob?: number;
		gender?: string;
		first_name?: string;
		last_name?: string;
		full_name?: string;
		phone?: string;
		address?: string;
		identity_card?: string;
		identity_card_date?: number;
		identity_card_place?: string;
		username: string;
		email: string;
		is_active: true;
		sso_sub: string;
		roles?: ERolesUsers[];
	}

	export interface IThread {
		id: number;
		user_id: number;
		title: string;
	}
}
