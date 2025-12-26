import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function postActivityOutCome(idActivity: string, payLoad: any) {
	return axios.post(`${ipCCT}/activity-outcome/add-evidence/${idActivity}`, payLoad);
}

export async function deleteActivity(idActivity: string) {
	return axios.delete(`${ipCCT}/activity-outcome/me/${idActivity}`);
}
