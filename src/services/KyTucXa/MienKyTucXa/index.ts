import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';

export async function postMienKyTucXaMe(payLoad: { urlMinhChung: string }) {
	return axios.post(`${ipCsvc}/mien-ky-tuc-xa/me`, payLoad);
}

export async function putMienKyTucXaMe(payLoad: { urlMinhChung: string }) {
	return axios.put(`${ipCsvc}/mien-ky-tuc-xa/me`, payLoad);
}

export async function getMienKyTucXaMe(maNamHoc?: string) {
	return axios.get(`${ipCsvc}/mien-ky-tuc-xa/me/one`, { params: { maNamHoc } });
}
