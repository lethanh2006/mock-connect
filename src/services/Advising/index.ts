import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';
import type { AdvisingType } from './constant';

export const listAdvisors = (advisingType: AdvisingType) =>
	axios.get(`${ipCCT}/advising/advisors`, { params: { advisingType } });

export const getAdvisorSlots = (advisorSsoId: string, params?: { from?: string; to?: string }) =>
	axios.get(`${ipCCT}/advising/advisors/${advisorSsoId}/slots`, { params });
