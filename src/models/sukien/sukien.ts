import useInitModel from '@/hooks/useInitModel';
import type { EHinhThucGiangDay } from '@/services/HocTap/constant';
import { getSuKienTrongKhoang } from '@/services/SuKien';
import { ELoaiSuKien, locationPathMappingToESuKienType, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { last } from 'lodash';
import moment from 'moment';
import { useState } from 'react';

type Ngay = string;
interface StateItem {
	hinhThucGiangDay: EHinhThucGiangDay;
	tenSuKien: string;
	diaDiem: string;
	loaiSuKien: ELoaiSuKien;
	thoiGianBatDau: string;
	thoiGianKetThuc: string;
	_id: string;
}
type State = Record<
	Ngay,
	{
		thuTrongTuan: string;
		cacSuKien: StateItem[];
	}
>;

export default () => {
	const objInit = useInitModel<SuKien.IRecord>('su-kien/me');
	const [selectSuKiens, setSelectSuKiens] = useState<ELoaiSuKien[]>([
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.CA_NHAN,
		ELoaiSuKien.CHUNG,
		ELoaiSuKien.BAI_TAP,
		ELoaiSuKien.HOP_LOP,
	]);
	const { getModel, setLoading, setDanhSach } = objInit;
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [dataLich, setDataLich] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [dataCalendarDashboard, setDataCalendarDashboard] = useState<State>({});
	const [dataLichDashboard, setDataLichDashboard] = useState<any[]>();

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

	const setLichHienThiDashboardModel = (data: any[]) => {
		const nextState = data?.reduce<State>((result, item) => {
			if (!item?.thoiGianBatDau) {
				return result;
			}
			const ngayMoment = moment(item?.thoiGianBatDau);
			const ngayString = ngayMoment.format('YYYY-MM-DD');

			return {
				...result,
				[ngayString]: {
					thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayMoment.toDate().getDay()],
					cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
						...item,
						tenSuKien: item.title,
						diaDiem: item.phongHoc ?? item.diaDiem,
					}),
				},
			};
		}, {});
		if (nextState) setDataCalendarDashboard(nextState);
	};

	return {
		...objInit,
		dataCalendar,
		setDataCalendar,
		dataLich,
		setDataLich,
		dataCalendarDashboard,
		setDataCalendarDashboard,
		dataLichDashboard,
		setDataLichDashboard,
		getModel: getModel_,
		selectSuKiens,
		setSelectSuKiens,
		getSuKienTrongKhoangModel,
		setLichHienThiDashboardModel,
	};
};
