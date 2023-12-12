import { ipTaiChinh } from '@/utils/ip';
import axios from 'axios';

export async function getConfigMomo() {
	return axios.get(`${ipTaiChinh}/momo/config`);
}

export async function postThongTinMomo(payload: { identityCode: string; redirectUrl: string }) {
	return axios.post(`${ipTaiChinh}/momo/payment-url`, { ...payload, requestType: 'captureWallet' });
}

export const getSoDuViSinhVien = () => {
	return axios.get(`${ipTaiChinh}/transaction/wallet/in-out/me`);
};

export const dongTruocHocPhi = (payLoad: any) => {
	return axios.post(`${ipTaiChinh}/transaction/me/top-up`, payLoad);
};

export const thanhToanFullBill = (payLoad: any) => {
	return axios.post(`${ipTaiChinh}/transaction/me`, payLoad);
};

export const huyThanhToanGiaoDich = (transactionId: string) => {
	return axios.post(`${ipTaiChinh}/transaction/${transactionId}/me/cancel`);
};
