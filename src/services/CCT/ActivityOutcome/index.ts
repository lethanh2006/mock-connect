import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';
import { EActivityCategory } from '../constant';

export async function postActivityOutCome(idActivity: string, payLoad: any) {
	return axios.post(`${ipCCT}/activity-outcome/add-evidence/${idActivity}`, payLoad);
}

export async function deleteActivity(idActivityOutCome: string) {
	return axios.delete(`${ipCCT}/activity-outcome/me/${idActivityOutCome}`);
}

export async function getAnalyticsStudent(activityCategory: EActivityCategory) {
	return axios.get(`${ipCCT}/activity-outcome/analytics/student/${activityCategory}`);
}

export async function thongKeLevels() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/student/by-level`);
}

export async function thongKeAttributes() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/student/by-attributes`);
}

export async function thongKeActivityType() {
	return axios.get(`${ipCCT}/activity-outcome/statistics/student/by-activity-type`);
}
