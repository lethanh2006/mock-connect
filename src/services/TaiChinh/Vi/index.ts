import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';
import type { Vi } from './typing';

export const getViCuaToi = () => {
	return axios.get(`${ipTaiChinh}/vi/me`);
};

export const postYeuCauRutTien = (payload: Vi.TYeuCauRutTienPayload) => {
	return axios.post(`${ipTaiChinh}/yeu-cau-rut-tien`, payload);
};
