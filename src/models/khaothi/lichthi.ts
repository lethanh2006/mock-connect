import { getLichThiTrongKhoang } from '@/services/KhaoThi/LichThi';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [danhSach, setDanhSach] = useState<LichThi.IRecord[]>([]);

	/**
	 * Get lịch thi trong khoảng thời gian
	 * @param payload fromDate, toDate: ISO string
	 * @returns
	 */
	const getTrongKhoangModel = async (payload: { fromDate: string; toDate: string }): Promise<LichThi.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getLichThiTrongKhoang(payload);
			setDanhSach(response?.data?.data ?? []);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		setLoading,
		danhSach,
		setDanhSach,
		getTrongKhoangModel,
	};
};
