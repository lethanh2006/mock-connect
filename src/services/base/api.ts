import axios from '@/utils/axios';
import {
	ip3,
	keycloakClientID,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
} from '@/utils/ip';
import queryString from 'query-string';
import type { ESettingKey } from './constant';
import type { ISetting } from './typing';

// export async function getInfo() {
//   return axios.get(`${ip3}/user/me`);
// }

export async function getUserInfo() {
	return axios.get(keycloakUserInfoEndpoint);
}

export async function adminlogin(payload: { username?: string; password?: string }) {
	return axios.post(`${ip3}/auth/login`, { ...payload, platform: 'Web' });
}

export async function refreshAccesssToken(payload: { refreshToken: string }) {
	const data = {
		client_id: keycloakClientID,
		grant_type: 'refresh_token',
		refresh_token: payload.refreshToken,
	};

	return axios({
		url: keycloakTokenEndpoint,
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: queryString.stringify(data),
	});
}

// Cài đặt

export async function getSettingByKey(key: ESettingKey, ip?: string) {
	return axios.get(`${ip ?? ip3}/setting/${key}/value`);
}

export async function putSetting(data: ISetting, ip?: string) {
	return axios.put(`${ip ?? ip3}/setting/value`, data);
}

export async function getByKey(key: ESettingKey, ip?: string) {
	return axios.get(`${ip ?? ip3}/setting/one`, { params: { condition: { key: key } } });
}

export async function updateSetting(id: string, payload: { key: ESettingKey; value: any }, ip?: string) {
	return axios.put(`${ip ?? ip3}/setting/${id}`, payload);
}

export async function createSetting(payload: { key: ESettingKey; value: any }, ip?: string) {
	return axios.post(`${ip ?? ip3}/setting`, payload);
}
