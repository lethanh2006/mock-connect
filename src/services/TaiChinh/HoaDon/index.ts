import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function postThongTinMomo(payload: { identityCode: string; redirectUrl: string }) {
	return axios.post(`${ipTaiChinh}/momo/payment-url`, { ...payload, requestType: 'captureWallet' });
}
