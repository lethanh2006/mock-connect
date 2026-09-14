import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

/** Thống kê IDP/tư vấn của các sinh viên do cố vấn hiện tại phụ trách — `GET advisor/me/stats`. */
export async function getAdvisorStatsService(params?: { maNam?: string }) {
	return axios.get(`${ipCCT}/advisor/me/stats`, { params });
}
