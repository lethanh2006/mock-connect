import axios from '@/utils/axios';
import { ipNews, ipNewsWP } from '@/utils/ip';
import { type TinTucWP } from './typing';
import { WpCategoriesId } from './constant';

export async function getTinTucStrapi(params: { apiArticleName: string; page: number; size: number }) {
	return axios.get(`${ipNews}/api/dynamic-content`, {
		params: { ...params, sortOrder: 'DESC' },
		headers: { Authorization: undefined },
	});
}

export async function getMultiTinTucStrapi(params: { listContentType: string[]; page: number; size: number }) {
	return axios.get(`${ipNews}/api/dynamic-get-multi-content`, {
		params,
		headers: { Authorization: undefined },
	});
}

export async function getTinTucChiTietStrapi(params: { contentType: string; slug: string }) {
	return axios.get(`${ipNews}/api/dynamic-article-content`, {
		params,
		headers: { Authorization: undefined },
	});
}

export async function getTinTucWP(params: { page: number; per_page: number }) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}/wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia', categories: [WpCategoriesId.TIN_TUC_SU_KIEN] },
		headers: { Authorization: undefined },
	});
}

export async function getMultiTinTucWP(params: { page: number; per_page: number }) {
	return axios.get<TinTucWP.IRecord[]>(`${ipNewsWP}/wp-json/wp/v2/posts`, {
		params: { ...params, _embed: 'wp:featuredmedia', categories: [WpCategoriesId.TIN_TUC_SU_KIEN] },
		headers: { Authorization: undefined },
	});
}

export async function getTinTucChiTietWP({ id }: { id: string }) {
	return axios.get<TinTucWP.IRecord>(`${ipNewsWP}/wp-json/wp/v2/posts/${id}`, {
		headers: {
			Authorization: undefined,
		},
	});
}
