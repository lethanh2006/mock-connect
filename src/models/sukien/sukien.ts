import useInitModel from '@/hooks/useInitModel';
import { getSuKienTrongKhoang } from '@/services/SuKien';
import { ELoaiSuKien, ELoaiSuKienKhac, locationPathMappingToESuKienType } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { last } from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SuKien.IRecord>('su-kien/me');
	const [selectSuKiens, setSelectSuKiens] = useState<(ELoaiSuKien | ELoaiSuKienKhac)[]>([
		...Object.values(ELoaiSuKien),
		...Object.values(ELoaiSuKienKhac),
	]);

	const { getModel, setLoading, setDanhSach } = objInit;
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [dataLich, setDataLich] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [dataLichDashboard, setDataLichDashboard] = useState<any[]>();
	const [dataCalendarDashboard, setDataCalendarDashboard] = useState<any[]>([]);

	const getSuKienType = (): ELoaiSuKien | ELoaiSuKienKhac => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToESuKienType[suKienType as keyof typeof locationPathMappingToESuKienType]!;
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
		types?: (ELoaiSuKien | ELoaiSuKienKhac)[];
	}): Promise<SuKien.IRecord[]> => {
		setLoading(true);
		try {
			const response = await getSuKienTrongKhoang(payload);
			const data = response?.data?.data ?? [];
			setDanhSach(data);
			setDataLich(data);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		dataCalendar,
		setDataCalendar,
		dataLich,
		setDataLich,
		dataLichDashboard,
		setDataLichDashboard,
		getModel: getModel_,
		selectSuKiens,
		setSelectSuKiens,
		getSuKienTrongKhoangModel,
		dataCalendarDashboard,
		setDataCalendarDashboard,
	};
};
