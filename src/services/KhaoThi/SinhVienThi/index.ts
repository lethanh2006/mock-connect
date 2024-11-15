import type { EFileScope } from '@/services/uploadFile';
import { ipKhaoThi } from '@/utils/ip';
import axios from 'axios';

const defaultAxios = axios.create();

export async function getDiemThiHocKySinhVien(maHocKy: string, maHocPhan: string) {
	return axios.get(`${ipKhaoThi}/sinh-vien-thi/diem-thi/user/hoc-ky/${maHocKy}/hoc-phan/${maHocPhan}`);
}

export async function nopBaiTap(idHocPhan: string, payload: any) {
	return axios.put(`${ipKhaoThi}/sinh-vien-thi/${idHocPhan}/nop-bai`, payload);
}

//Upload file multiPart
export async function initFileMultiPart(payload: {
	filename: string;
	size: number;
	mimetype: string;
	ext: string;
	maHocKy?: string;
	maKyThi?: string;
	maHocPhan?: string;
	scope: EFileScope;
}) {
	return axios.post(`${ipKhaoThi}/file/multipart/init`, payload);
}

export async function uploadFileMultiPart(presignedUrl: any, file: any) {
	return defaultAxios.put(presignedUrl, file);
}

export async function uploadFileMultiPartComplete(payload: {
	fileId: string;
	parts: { etag: string; part: number }[];
}) {
	return axios.post(`${ipKhaoThi}/file/multipart/complete`, payload);
}
