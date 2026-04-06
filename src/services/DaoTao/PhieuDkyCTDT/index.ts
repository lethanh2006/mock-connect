export * from './constant';
import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getPhieuMeDotHienTaiInit(dotId: string) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/dot/${dotId}/init/me`;
	return axios.post(url);
}

import { PhieuDkCtdt } from './typing';

export async function putPhieuDkCtdtMe(phieuId: string, body?: Partial<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/${phieuId}/me`;
	return axios.put(url, body);
}

export async function submitPhieuDkCtdt(phieuId: string, body?: Partial<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/${phieuId}/me/submit`;
	return axios.put(url, body);
}

export async function duyetPhieuDkCtdt(phieuId: string, payload: { trangThai: string; ghiChu?: string }) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/${phieuId}/duyet`;
	return axios.put(url, payload);
}

export async function getPhieuDkCtdtMeByDot(dotId: string) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/dot/${dotId}/me`;
	return axios.get(url);
}

export async function getPhieuDkCtdtMe(phieuId: string) {
	const url = `${ipDaoTao}/phieu-dk-ctdt/${phieuId}/me`;
	return axios.get(url);
}
