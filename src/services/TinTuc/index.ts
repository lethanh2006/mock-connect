import axios from '@/utils/axios';
import { type TinTucWP } from './typing';

export async function getTinTucWP(ipNewsWP: string, params: { page: number; per_page: number; categories: number[] }) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia' },
		headers: { Authorization: undefined },
	});
}

export async function getMultiTinTucWP(
	ipNewsWP: string,
	params: { page: number; per_page: number; categories: number[] },
) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia' },
		headers: { Authorization: undefined },
	});
}

export async function getTinTucChiTietWP(ipNewsWP: string, { id }: { id: string }) {
	return axios.get<TinTucWP.IRecord>(`${ipNewsWP}wp-json/wp/v2/posts/${id}`, {
		headers: {
			Authorization: undefined,
		},
	});
}
