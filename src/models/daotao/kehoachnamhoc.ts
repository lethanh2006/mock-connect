import useInitModel from '@/hooks/useInitModel';
import { getKeHoachNamHocHienTai } from '@/services/DaoTao/KeHoachNamHoc';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KeHoachNamHoc.IRecord>('ke-hoach-nam-hoc', undefined, undefined, ipDaoTao);
	const [recordKHTheoTuan, setRecordKHTheoTuan] = useState<KeHoachNamHoc.IKeHoachTheoTuan>();
	const { setLoading, getAllModel, condition } = objInit;

	const getDataModel = async (namHocId: string): Promise<KeHoachNamHoc.IRecord[]> => {
		if (condition?.phienBanId) return getAllModel(false, { thuTuTuan: 1 }, { namHocId });
		else {
			setLoading(true);
			try {
				const res = await getKeHoachNamHocHienTai(namHocId);
				return res.data?.data;
			} catch (er) {
				return Promise.reject(er);
			} finally {
				setLoading(false);
			}
		}
	};

	return {
		...objInit,
		getDataModel,
		recordKHTheoTuan,
		setRecordKHTheoTuan,
	};
};
