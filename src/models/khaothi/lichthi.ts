import { getLichThiByHocKy, getLichThiTrongKhoang } from '@/services/KhaoThi/LichThi';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [danhSach, setDanhSach] = useState<LichThi.IRecord[]>([]);
	const [danhSachMe, setDanhSachMe] = useState<LichThi.IRecordMe[]>([]);

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

	/**
	 * Get lịch thi của tôi theo học kỳ
	 * @param payload maHocKy: string
	 * @returns
	 */
	const getMeByHocKyModel = async (payload: { maHocKy: string }): Promise<LichThi.IRecordMe[]> => {
		setLoading(true);
		try {
			const response = await getLichThiByHocKy(payload);
			setDanhSachMe(response?.data?.data ?? []);
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
		danhSachMe,
		setDanhSachMe,
		getTrongKhoangModel,
		getMeByHocKyModel,
	};
};
