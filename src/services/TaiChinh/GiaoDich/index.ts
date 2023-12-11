import { ipTaiChinh } from '@/utils/ip';
import axios from 'axios';

export const getSoDuViSinhVien = () => {
	return axios.get(`${ipTaiChinh}/transaction/wallet/me`);
};

export const dongTruocHocPhi = (payLoad: any) => {
	return axios.post(`${ipTaiChinh}/transaction/me/top-up/manual`, payLoad);
};

export const thanhToanFullBill = (payLoad: any) => {
	return axios.post(`${ipTaiChinh}/transaction/me`, payLoad);
};
