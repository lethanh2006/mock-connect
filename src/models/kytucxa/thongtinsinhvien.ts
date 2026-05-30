import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';

export default () => {
	const objInit = useInitModel<DangKyKyTucXa.IThongTinSinhVien>('sinh-vien', undefined, undefined, ipDaoTao);
	const { getService, setRecord, setLoading } = objInit;

	const getThongTinSinhVienModel = async () => {
		setLoading(true);
		try {
			const res = await getService({}, 'me');
			setRecord(res?.data?.data);
			return res?.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getThongTinSinhVienModel,
	};
};
