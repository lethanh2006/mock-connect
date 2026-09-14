import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export const submitIdp = (id: string) => axios.put(`${ipCCT}/idp/${id}/submit`);

export const getCurrentIdp = () => axios.get(`${ipCCT}/idp/me/current`);
