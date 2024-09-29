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

	const getDashboardModel = async (categories?: number[]): Promise<TinTucWP.IRecord[]> => {
		setLoading(true);
		const payload = {
			page: 1,
			per_page: 5,
			categories: categories ?? [APP_CONFIG_TIN_TUC_WP_CATEGORY],
		};

		try {
			const response = await getMultiTinTucWP(payload);
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
		categories?: number[],
	): Promise<TinTucWP.IRecord[]> => {
		setLoading(true);
		const payload = {
			page: paramPage || page,
			per_page: paramLimit || limit,
			categories: categories ?? [APP_CONFIG_TIN_TUC_WP_CATEGORY],
		};

		try {
			const response = await getTinTucWP(payload);
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

	const getByIdModel = async (id: string, isSetRecord?: boolean): Promise<TinTucWP.IRecord> => {
		if (!id) return Promise.reject();
		setLoading(true);
		try {
			const response = await getTinTucChiTietWP({ id });
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
