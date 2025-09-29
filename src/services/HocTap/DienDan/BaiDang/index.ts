import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function votePoll(baiDangId: string, luaChon: string[]) {
	return axios.post(`${ipDaoTao}/binh-chon/binh-chon`, { baiDangId, luaChon });
}

export async function exportPollData(baiDangId: string) {
	return axios.get(`${ipDaoTao}/binh-chon/export/${baiDangId}`, {
		responseType: 'arraybuffer',
	});
}
