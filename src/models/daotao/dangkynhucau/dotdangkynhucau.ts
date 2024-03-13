import useInitModel from '@/hooks/useInitModel';
import { getDotDangKyNhuCauHocKy } from '@/services/DaoTao/DangKyNhuCau';
import { type DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DangKyNhuCau.IDotDangKy>('dot-dang-ky-nhu-cau', undefined, undefined, ipDaoTao);

	const { setLoading, setRecord } = objInit;

	const getDotDangKyNhuCauHocKyModel = async (maHocKy: string): Promise<DangKyNhuCau.IDotDangKy> => {
		setLoading(true);
		try {
			const res = await getDotDangKyNhuCauHocKy(maHocKy);
			setRecord(res.data?.data);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getDotDangKyNhuCauHocKyModel,
	};
};
