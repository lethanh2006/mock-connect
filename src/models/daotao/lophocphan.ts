import useInitModel from '@/hooks/useInitModel';
import { getMoodleLopHocPhan } from '@/services/HocTap/LopHocPhan';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
	const { getByIdModel, getModel, getAllModel, setLoading } = objInit;

	const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
		params.maHocKy && getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

	const sinhVienGetAllModel = async (params?: any): Promise<LopHocPhan.IRecord[]> =>
		getAllModel(undefined, undefined, params, undefined, 'sinh-vien/all');

	const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> => getByIdModel(`${idLop}/sinh-vien`);

	const getMoodleLopHocPhanModel = async (lopHocPhanId: string): Promise<any> => {
		setLoading(true);

		try {
			const res = await getMoodleLopHocPhan(lopHocPhanId);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		sinhVienGetModel,
		sinhVienGetByIdModel,
		sinhVienGetAllModel,
		getMoodleLopHocPhanModel,
	};
};
