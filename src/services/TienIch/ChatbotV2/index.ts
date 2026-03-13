import axios from '@/utils/axios';
import { ipChatbot } from '@/utils/ip';
import type { ChatbotAmiV2 } from './typing';

export async function getUserChatBot(sso_id: string) {
	return axios.get(`${ipChatbot}/api/v1/users/sso_id/${sso_id}`, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return data;
		},
	});
}

export async function createUserChatBot(payLoad: ChatbotAmiV2.IUser) {
	return axios.post(`${ipChatbot}/api/v1/users`, payLoad, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return JSON.stringify(payLoad);
		},
	});
}

export async function createThreadChatBot(payLoad: ChatbotAmiV2.IThread) {
	return axios.post(`${ipChatbot}/api/v1/thread/create`, payLoad, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
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
				if (headers) {
					if (headers.Authorization) delete headers.Authorization;
					if (headers.common?.Authorization) delete headers.common.Authorization;

					if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
					if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
				}
				headers['Content-Type'] = 'application/json';
				return JSON.stringify({ user_id, thread_id, message });
			},
		},
	);
}

export async function getThreadUser(user_id: number) {
	return axios.get(`${ipChatbot}/api/v1/thread/user/${user_id}`, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return data;
		},
	});
}

export async function getChiTietThread(thread_id: number) {
	return axios.get(`${ipChatbot}/api/v1/thread/detail/${thread_id}`, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return data;
		},
	});
}

export async function updateTitleThread(payLoad: any) {
	return axios.put(`${ipChatbot}/api/v1/thread/update-title`, payLoad, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return JSON.stringify(payLoad);
		},
	});
}

export async function deleteThread(thread_id: number) {
	return axios.delete(`${ipChatbot}/api/v1/thread/delete/${thread_id}`, {
		transformRequest: (data, headers) => {
			if (headers) {
				if (headers.Authorization) delete headers.Authorization;
				if (headers.common?.Authorization) delete headers.common.Authorization;

				if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
				if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
			}
			headers['Content-Type'] = 'application/json';
			return JSON.stringify({ thread_id });
		},
	});
}
