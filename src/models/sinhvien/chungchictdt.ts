import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { getChungChiDauRa } from '@/services/DaoTao/SinhVien';
import { useState } from 'react';

export default () => {
	const [danhSach, setDanhSach] = useState<ChuongTrinhDaoTao.IChungChiCTDT[]>();
	const [record, setRecord] = useState<ChuongTrinhDaoTao.IChungChiCTDT>();
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const getTienTrinhChungChiCTDTModel = async (): Promise<ChuongTrinhDaoTao.IChungChiCTDT[]> => {
		setLoading(true);
		try {
			const response = await getChungChiDauRa();
			setDanhSach(response?.data?.data ?? []);
			return response?.data?.data;
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
		loading,
		setLoading,
		visibleForm,
		setVisibleForm,
		getTienTrinhChungChiCTDTModel,
	};
};
