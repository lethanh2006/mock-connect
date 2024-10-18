import useInitModel from '@/hooks/useInitModel';
import { getMyLopHanhChinh } from '@/services/DaoTao/SinhVien';
import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh', undefined, undefined, ipDaoTao);
	const { getModel, getByIdModel, setLoading, setDanhSach } = objInit;
	const [recordDetail, setRecordDetail] = useState<LopHanhChinh.IRecord>();

	const sinhVienGetModel = async (params: any, maHocKy?: string): Promise<LopHanhChinh.IRecord[]> =>
		getModel(
			params,
			undefined,
			undefined,
			undefined,
			undefined,
			maHocKy ? `sinh-vien/page/hoc-ky/${maHocKy}` : 'sinh-vien/page',
		);

	const sinhVienGetByIdModel = async (idLop: string, maHocKy?: string): Promise<LopHanhChinh.IRecord> =>
		getByIdModel(`${idLop}/sinh-vien${maHocKy ? `/${maHocKy}` : ''}`).then((res) => {
			setRecordDetail(res);
			return res;
		});

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
		recordDetail,
		setRecordDetail,
		sinhVienGetModel,
		sinhVienGetByIdModel,
		getMeModel,
	};
};
