import axios from '@/utils/axios';
import { ipNewsWP } from '@/utils/ip';
import { type TinTucWP } from './typing';

export async function getTinTucWP(params: { page: number; per_page: number }) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia', categories: [APP_CONFIG_TIN_TUC_WP_CATEGORY] },
		headers: { Authorization: undefined },
	});
}

export async function getMultiTinTucWP(params: { page: number; per_page: number }) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia', categories: [APP_CONFIG_TIN_TUC_WP_CATEGORY] },
		headers: { Authorization: undefined },
	});
}

export async function getTinTucChiTietWP({ id }: { id: string }) {
	return axios.get<TinTucWP.IRecord>(`${ipNewsWP}wp-json/wp/v2/posts/${id}`, {
		headers: {
			Authorization: undefined,
		},
	});
}
