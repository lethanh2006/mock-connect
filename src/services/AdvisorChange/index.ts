import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';
import type { EAdvisorType } from './constant';

export const getMyAdvisor = (condition?: { type?: EAdvisorType }) =>
	axios.get(`${ipCCT}/student/me/advisor`, { params: condition ? { condition } : undefined });

export const getAdvisorsOfMajor = (maNganh: string, params?: { condition?: any; filter?: any[] }) =>
	axios.get(`${ipCCT}/advisor/majors/${maNganh}`, { params });
