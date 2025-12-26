import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function registerActivity(idActivity: string) {
	return axios.post(`${ipCCT}/activity-outcome/register/${idActivity}`);
}
