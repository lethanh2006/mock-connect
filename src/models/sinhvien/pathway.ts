import useInitModel from '@/hooks/useInitModel';
import {
	choosePathway as choosePathwayService,
	getManyKhoiLuaChonKhoaNganh,
	// getPathwayChoice,
	getPathwayList,
} from '@/services/DaoTao/ChuongTrinhDaoTao';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IKhoiKienThuc>('chuong-trinh-dao-tao', undefined, undefined, ipDaoTao);
	const { setLoading, setFormSubmiting, formSubmiting, setDanhSach } = objInit;

	const [selectedKhoiLuaChon, setSelectedKhoiLuaChon] = useState<ChuongTrinhDaoTao.IKhoiKienThuc | null>(null);
	const [khoiLuaChonList, setKhoiLuaChonList] = useState<ChuongTrinhDaoTao.IKhoiKienThuc[]>([]);
	const [isLoadingKhoiLuaChon, setIsLoadingKhoiLuaChon] = useState<boolean>(false);
	const [registeredPathway, setRegisteredPathway] = useState<ChuongTrinhDaoTao.IKhoiLuaChon[]>([]);

	const getKhoiLuaChonListDataModel = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.IKhoiKienThuc> => {
		setIsLoadingKhoiLuaChon(true);
		try {
			const response = await getManyKhoiLuaChonKhoaNganh(maKhoaNganh);
			setKhoiLuaChonList(response?.data?.data);

			setSelectedKhoiLuaChon(response?.data?.data?.[0]);
			return response?.data?.data ?? [];
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setIsLoadingKhoiLuaChon(false);
		}
	};

	const getPathwayListModel = async (
		maKhoaNganh: string,
		maKhoiLuaChon: string,
	): Promise<ChuongTrinhDaoTao.IKhoiKienThuc[]> => {
		setLoading(true);
		try {
			const data = await getPathwayList(maKhoaNganh, maKhoiLuaChon);
			setDanhSach(data.data.data);
			return data.data.data;
		} catch (error) {
			setDanhSach([]);
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const getChosenPathwayDataModel = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.IKhoiLuaChon> => {
		try {
			// const response = await getPathwayChoice(maKhoaNganh);
			// setRegisteredPathway(response?.data?.data);

			// return response?.data?.data ?? null;
			setRegisteredPathway([]);
			return [] as any;
		} catch (error: any) {
			return Promise.reject(error);
		}
	};

	const handleSelectPathway = async (
		payload: {
			maKhoaNganh: string;
			maKhoiCha: string;
			maKhoiCon: string;
			dotDangKyPathwayId: string;
		}[],
		onSuccess?: () => void,
	) => {
		setFormSubmiting(true);
		try {
			await choosePathwayService(payload);
			message.success('Đăng ký thành công');
			onSuccess?.();
		} catch (error: any) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		handleSelectPathway,
		selectedKhoiLuaChon,
		setSelectedKhoiLuaChon,
		khoiLuaChonList,
		setKhoiLuaChonList,
		isLoadingKhoiLuaChon,
		setIsLoadingKhoiLuaChon,
		registeredPathway,
		setRegisteredPathway,
		formSubmiting,
		getKhoiLuaChonListDataModel,
		getChosenPathwayDataModel,
		getPathwayListModel,
	};
};
