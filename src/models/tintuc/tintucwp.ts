import { getMultiTinTucWP, getTinTucChiTietWP, getTinTucWP } from '@/services/TinTuc';
import { type TinTucWP } from '@/services/TinTuc/typing';
import { useState } from 'react';

export default () => {
	const [danhSach, setDanhSach] = useState<TinTucWP.IRecord[]>([]);
	const [record, setRecord] = useState<TinTucWP.IRecord>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);

	const getDashboardModel = async (category?: number, ipNewsWP?: string): Promise<TinTucWP.IRecord[]> => {
		setLoading(true);
		const payload = {
			page: 1,
			per_page: 5,
			categories: category ? [category] : [APP_CONFIG_TIN_TUC_WP_CATEGORY],
		};

		try {
			const response = await getMultiTinTucWP(ipNewsWP ? ipNewsWP : APP_CONFIG_URL_LANDING, payload);
			if (setDanhSach) setDanhSach(response?.data ?? []);

			return response?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getModel = async (
		paramPage?: number,
		paramLimit?: number,
		category?: number,
		ipNewsWP?: string,
	): Promise<TinTucWP.IRecord[]> => {
		setLoading(true);
		const payload = {
			page: paramPage || page,
			per_page: paramLimit || limit,
			categories: category ? [category] : [APP_CONFIG_TIN_TUC_WP_CATEGORY],
		};

		try {
			const response = await getTinTucWP(ipNewsWP ? ipNewsWP : APP_CONFIG_URL_LANDING, payload);
			const totalPosts = response.headers?.['x-wp-total'];
			if (setDanhSach) setDanhSach(response?.data ?? []);
			setTotal(totalPosts ?? 0);

			return response?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (id: string, isSetRecord?: boolean, ipNewsWP?: string): Promise<TinTucWP.IRecord> => {
		if (!id) return Promise.reject();
		setLoading(true);
		try {
			const response = await getTinTucChiTietWP(ipNewsWP ? ipNewsWP : APP_CONFIG_URL_LANDING, { id });
			if (isSetRecord !== false) setRecord(response?.data ?? null);
			return response?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		page,
		setPage,
		limit,
		setLimit,
		loading,
		setLoading,
		total,
		setTotal,
		getModel,
		getByIdModel,
		getDashboardModel,
	};
};
