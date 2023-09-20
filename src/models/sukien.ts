import useInitModel from '@/hooks/useInitModel';
import { getSuKienTrongKhoang } from '@/services/SuKien';
import { ELoaiSuKien, locationPathMappingToESuKienType } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { last } from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SuKien.IRecord>('su-kien');

	const { getModel, handleView, setRecord, setVisibleForm, setEdit, setLoading, setDanhSach } = objInit;

	// const [thongKeTheoNamData, setThongKeTheoNamData] = useState<SuKien.ThongKeTheoNam | undefined>(undefined);
	// const [isLoadingThongKeTheoNam, setIsLoadingThongKeTheoNam] = useState(false);

	// const [thongKeTheoSuKienData, setThongKeTheoSuKienData] = useState<SuKien.ThongKeTheoSuKien | undefined>(undefined);
	// const [isLoadingThongKeTheoSuKien, setIsLoadingThongKeTheoSuKien] = useState(false);

	// const [isLoadingThongTinSuKien, setIsLoadingThongTinSuKien] = useState(true);
	// const [thongTinSuKien, setThongTinSuKien] = useState<SuKien.ThongTinSukien | undefined>(undefined);

	const [isVisibleFormDetail, setIsVisibleFormDetail] = useState(false);

	const [isVisibleThongKe, setIsVisibleThongKe] = useState(false);

	const getSuKienType = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToESuKienType[suKienType];
	};

	// const getThongKeSuKienTheoNam = async () => {
	// 	setThongKeTheoNamData(undefined);
	// 	setIsLoadingThongKeTheoNam(true);
	// 	try {
	// 		const response = await getThongKeSuKien({ nam: '2023', loaiSuKien: getSuKienType() });
	// 		setThongKeTheoNamData(response.data?.data as SuKien.ThongKeTheoNam);
	// 	} finally {
	// 		setIsLoadingThongKeTheoNam(false);
	// 	}
	// };

	// const getThongKeSuKienSuKien = async (id: SuKien.IRecord['_id']) => {
	// 	setThongKeTheoSuKienData(undefined);
	// 	setIsLoadingThongKeTheoSuKien(true);
	// 	try {
	// 		const response = await getThongKeSuKien({ idSuKien: id, loaiSuKien: getSuKienType() });
	// 		setThongKeTheoSuKienData(response.data?.data as SuKien.ThongKeTheoSuKien);
	// 	} finally {
	// 		setIsLoadingThongKeTheoSuKien(false);
	// 	}
	// };

	const getModel_: typeof getModel = (
		paramCondition,
		filterParams,
		sortParam,
		paramPage,
		paramLimit,
		_path,
		otherQuery,
		isSetDanhSach,
		_isAbsolutePath,
	) => {
		// getThongKeSuKienTheoNam();
		return getModel(
			{ ...paramCondition, loaiSuKien: getSuKienType() },
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			'su-kien/page',
			otherQuery,
			isSetDanhSach,
			true,
		);
	};

	// const handleGetThongTinSuKien = async (id: string) => {
	// 	setIsLoadingThongTinSuKien(true);
	// 	try {
	// 		const response = await getThongTinSuKien(id);
	// 		setThongTinSuKien(response.data?.data);
	// 	} finally {
	// 		setIsLoadingThongTinSuKien(false);
	// 	}
	// };

	const handleView_: typeof handleView = (rec) => {
		setEdit(false);
		setIsVisibleFormDetail(true);
		setVisibleForm(false);
		setRecord(rec);
	};

	const handleViewThongKe: typeof handleView = (rec) => {
		setRecord(rec);
		setEdit(false);
		setIsVisibleThongKe(true);
		setVisibleForm(false);
		if (rec?._id) {
			// getThongKeSuKienSuKien(rec?._id);
		}
	};

	const [selectSuKiens] = useState<ELoaiSuKien[]>([
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.CA_NHAN,
		ELoaiSuKien.CHUNG,
	]);

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
		// thongKeTheoNamData,
		// isLoadingThongKeTheoNam,
		getModel: getModel_,
		getSuKienType,
		setIsVisibleFormDetail,
		isVisibleFormDetail,
		handleView: handleView_,
		// getThongTinSuKien: handleGetThongTinSuKien,
		// isLoadingThongTinSuKien,
		// thongTinSuKien,
		handleViewThongKe,
		isVisibleThongKe,
		setIsVisibleThongKe,
		// isLoadingThongKeTheoSuKien,
		// thongKeTheoSuKienData,
		selectSuKiens,
		getSuKienTrongKhoangModel,
	};
};
