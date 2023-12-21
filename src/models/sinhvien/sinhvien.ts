import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import { getMyKhoaNganh, getThongTinSinhVien } from '@/services/DaoTao/SinhVien';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { useState } from 'react';

export default () => {
	const [record, setRecord] = useState<SinhVien.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [khoaNganhMe, setKhoaNganhMe] = useState<KhoaNganh.TMyKhoaNganh>();

	const getThongTinCuaToiModel = async (): Promise<SinhVien.IRecord> => {
		setLoading(true);
		try {
			const response = await getThongTinSinhVien();
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getKhoaNganhMeModel = async (): Promise<KhoaNganh.TMyKhoaNganh> => {
		setLoading(true);
		try {
			const response = await getMyKhoaNganh();
			setKhoaNganhMe(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		record,
		setRecord,
		loading,
		setLoading,
		getThongTinCuaToiModel,
		khoaNganhMe,
		getKhoaNganhMeModel,
	};
};
