import axios from '@/utils/axios';
import { ipChatbot } from '@/utils/ip';
import type { ChatbotAmi } from './typing';

export async function postChatMessage(question: string) {
	return axios.post(
		'https://ami.ptit.edu.vn/',
		{ question },
		{
			transformRequest: (data, headers) => {
				delete headers.common.Authorization;
				headers['Content-Type'] = 'application/json';
				return JSON.stringify({ question });
			},
		},
	);
}

export async function postVoiceMessage(text: string, id: string) {
	return axios.post(
		'https://ami.ptit.edu.vn/api3/voice_video',
		{ text, id },
		{
			transformRequest: (data, headers) => {
				delete headers.common.Authorization;
				headers['Content-Type'] = 'application/json';
				return JSON.stringify({ text, id });
			},
		},
	);
}

export async function createUserChatBot(payLoad: ChatbotAmi.IUser) {
	return axios.post(`${ipChatbot}/api/v1/users`, payLoad, {
		transformRequest: (data, headers) => {
			delete headers.common.Authorization;
			headers['Content-Type'] = 'application/json';
			return JSON.stringify(payLoad);
		},
	});
}

export async function createThreadChatBot(payLoad: ChatbotAmi.IThread) {
	return axios.post(`${ipChatbot}/api/v1/thread/create`, payLoad, {
		transformRequest: (data, headers) => {
			delete headers.common.Authorization;
			headers['Content-Type'] = 'application/json';
			return JSON.stringify(payLoad);
		},
	});
}

export async function postChatBot(user_id: number, thread_id: number, message: string) {
	return axios.post(
		`${ipChatbot}/api/v1/chat`,
		{ user_id, thread_id, message },
		{
			transformRequest: (data, headers) => {
				delete headers.common.Authorization;
				headers['Content-Type'] = 'application/json';
				return JSON.stringify({ user_id, thread_id, message });
			},
		},
	);
}
