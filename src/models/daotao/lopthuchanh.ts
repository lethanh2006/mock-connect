import useInitModel from '@/hooks/useInitModel';
import useInitService from '@/hooks/useInitService';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<LopHocPhan.IRecordNhanSuLopHP[]>();
	const { setLoading, getModel, getByIdModel } = objInit;
	const { getAllService } = useInitService('lop-hp-ns', ipDaoTao);

	const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
		getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

	const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> => getByIdModel(`${idLop}/sinh-vien`);

	const getAllNhanSuModel = async (lopHocPhanId: string): Promise<LopHocPhan.IRecordNhanSuLopHP[]> => {
		setLoading(true);
		try {
			const payload = {
				condition: { lopHocPhanId },
			};
			const response = await getAllService(payload);
			const data = response?.data?.data ?? [];
			setDanhSachNhanSu(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		danhSachNhanSu,
		setDanhSachNhanSu,
		getAllNhanSuModel,
		sinhVienGetModel,
		sinhVienGetByIdModel,
	};
};
