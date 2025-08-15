import axios from '@/utils/axios';

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
