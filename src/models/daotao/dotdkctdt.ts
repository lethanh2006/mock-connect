import useInitModel from '@/hooks/useInitModel';
import { getKyHienTai } from '@/services/DaoTao/DangKyChuyenNganh';
import { DangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DangKyChuyenNganh.IDotDangKy>('dot-dk-ctdt', undefined, undefined, ipDaoTao);
	const { setRecord, setLoading } = objInit;

	const fetchDotDangKy = async (loai: 'minor' | 'concentration') => {
		setRecord(undefined);
		setLoading(true);
		try {
			const response = await getKyHienTai(loai);
			const data = response?.data?.data;
			setRecord(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		fetchDotDangKy,
	};
};
