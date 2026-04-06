import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function updateMyCCT(payLoad: any) {
	return axios.put(`${ipCCT}/my-cct/me`, payLoad);
}

export async function submitMyCCT() {
	return axios.post(`${ipCCT}/my-cct/submit`);
}
