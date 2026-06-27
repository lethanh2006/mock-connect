import { getChuanDauRaMucTieu } from '@/services/DaoTao/ChuanDauRaMucTieuHocPhan';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState(false);
	const [record, setRecord] = useState<any>(null);

	const getOneChuongTrinh = async (params: { deCuongId: string }): Promise<any> => {
		setLoading(true);

		try {
			const res = await getChuanDauRaMucTieu(params.deCuongId);
			const data = res.data?.data ?? res.data;
			setRecord(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		record,
		getOneChuongTrinh,
	};
};
