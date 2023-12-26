import useInitModel from '@/hooks/useInitModel';
import { getMyLopHanhChinh } from '@/services/DaoTao/SinhVien';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh', undefined, undefined, ipDaoTao);
	const { getModel, getByIdModel, setLoading, setDanhSach } = objInit;

	const sinhVienGetModel = async (params: any): Promise<LopHanhChinh.IRecord[]> =>
		getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

	const sinhVienGetByIdModel = async (idLop: string): Promise<LopHanhChinh.IRecord> =>
		getByIdModel(`${idLop}/sinh-vien`);

	const getMeModel = async (): Promise<LopHanhChinh.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getMyLopHanhChinh();
			const data = response.data?.data?.map((item: LopHanhChinh.IRecordSinhVien) => item.lopHanhChinh);
			setDanhSach(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		sinhVienGetModel,
		sinhVienGetByIdModel,
		getMeModel,
	};
};
