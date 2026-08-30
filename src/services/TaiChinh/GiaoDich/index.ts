import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function getConfigMomo() {
	return axios.get(`${ipTaiChinh}/momo/config`);
}

export async function postThongTinMomo(payload: { identityCode: string; redirectUrl: string }) {
	return axios.post(`${ipTaiChinh}/momo/payment-url`, { ...payload, requestType: 'captureWallet' });
}

export const getBankQr = (identityCode: string) => {
	return axios.post(`${ipTaiChinh}/transaction/me/qr`, { identityCode }, { responseType: 'blob' });
};

export const getSoDuViSinhVien = (idDotThu?: string | null) => {
	return axios.get(`${ipTaiChinh}/transaction/wallet/me/dot-thu/${idDotThu}`);
};

export const getTongGiaoDichSinhVien = () => {
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
