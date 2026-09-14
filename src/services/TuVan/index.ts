import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

/** Thống kê lịch tư vấn của cố vấn hiện tại — `GET advising/bookings/advisor/me/stats`. */
export async function getAdvisorBookingStatsService(params?: { maNam?: string }) {
	return axios.get(`${ipCCT}/advising/bookings/advisor/me/stats`, { params });
}
