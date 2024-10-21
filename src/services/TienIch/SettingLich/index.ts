import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function postMeSettingLich(payload: any) {
	return axios.post(`${ip3}/setting-lich/me`, payload);
}

export async function putMeSettingLich(id: string, payload: any) {
	return axios.put(`${ip3}/setting-lich/${id}/me`, payload);
}
