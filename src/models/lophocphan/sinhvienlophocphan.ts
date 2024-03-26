import { getDiemLopHocPhan } from '@/services/HocTap/LopHocPhan';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [record, setRecord] = useState<LopHocPhan.IRecordSinhVienLopHP>();

	const sinhVienGetDiemLHPModel = async (lopHocPhanId: string): Promise<LopHocPhan.IRecordSinhVienLopHP> => {
		setLoading(true);
		try {
			const response = await getDiemLopHocPhan(lopHocPhanId);
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		setLoading,
		record,
		setRecord,
		sinhVienGetDiemLHPModel,
	};
};
