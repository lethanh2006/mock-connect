import useInitModel from '@/hooks/useInitModel';
import { getSuKienTrongKhoang } from '@/services/SuKien';
import { ELoaiSuKien, locationPathMappingToESuKienType } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { last } from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SuKien.IRecord>('su-kien/me');
	const [selectSuKiens, setSelectSuKiens] = useState<ELoaiSuKien[]>([
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.CA_NHAN,
		ELoaiSuKien.CHUNG,
	]);
	const { getModel, setLoading, setDanhSach } = objInit;

	const getSuKienType = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToESuKienType[suKienType];
	};

	const getModel_: typeof getModel = (paramCondition, filterParams, sortParam, paramPage, paramLimit) => {
		return getModel({ ...paramCondition, loaiSuKien: getSuKienType() }, filterParams, sortParam, paramPage, paramLimit);
	};

	/**
	 * Get sự kiện trong khoảng thời gian
	 * @param payload fromDate, toDate: ISO string
	 * @returns
	 */
	const getSuKienTrongKhoangModel = async (payload: {
		fromDate: string;
		toDate: string;
		types?: ELoaiSuKien[];
	}): Promise<SuKien.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getSuKienTrongKhoang(payload);
			setDanhSach(response?.data?.data ?? []);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getModel: getModel_,
		selectSuKiens,
		setSelectSuKiens,
		getSuKienTrongKhoangModel,
	};
};
