import axios from '@/utils/axios';

export async function postChatMessage(question: string) {
	return axios.post(
		'https://ami.ptit.edu.vn/',
		{ question },
		{
			transformRequest: (data, headers) => {
				if (headers) {
					if (headers.Authorization) delete headers.Authorization;
					if (headers.common?.Authorization) delete headers.common.Authorization;

					if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
					if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
				}
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
				if (headers) {
					if (headers.Authorization) delete headers.Authorization;
					if (headers.common?.Authorization) delete headers.common.Authorization;

					if (headers['x-data-partition-code']) delete headers['x-data-partition-code'];
					if (headers.common?.['x-data-partition-code']) delete headers.common['x-data-partition-code'];
				}
				headers['Content-Type'] = 'application/json';
				return JSON.stringify({ text, id });
			},
		},
	);
}
