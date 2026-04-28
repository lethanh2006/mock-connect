import useInitModel from '@/hooks/useInitModel';
import {
	choosePathway as choosePathwayService,
	getManyKhoiLuaChonKhoaNganh,
	getPathwayChoice,
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
	const [currentKhoiLuaChonMa, setCurrentKhoiLuaChonMa] = useState<string | null>(null);
	const [currentKhoiLuaChonTen, setCurrentKhoiLuaChonTen] = useState<string | null>(null);
	const [khoiLuaChonList, setKhoiLuaChonList] = useState<ChuongTrinhDaoTao.IKhoiKienThuc[]>([]);
	const [isLoadingKhoiLuaChon, setIsLoadingKhoiLuaChon] = useState<boolean>(false);

	const [registeredPathway, setRegisteredPathway] = useState<ChuongTrinhDaoTao.IKhoiLuaChon | null>(null);

	// Lấy danh sách pathway
	const fetchPathwayList = async (
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

	// Lấy khối lựa chọn đã chọn từ cache
	const getSelectedKhoiLuaChonFromCache = (maKhoiLuaChon: string): ChuongTrinhDaoTao.IKhoiKienThuc | null => {
		const foundKhoi = khoiLuaChonList.find((item) => item.ma === maKhoiLuaChon);
		setSelectedKhoiLuaChon(foundKhoi || null);
		return foundKhoi || null;
	};

	// Lấy thông tin của pathway đã được sinh viên chọn (đã đăng ký)
	const getChosenPathwayData = async (
		maKhoaNganh: string,
		maKhoiLuaChon: string,
	): Promise<ChuongTrinhDaoTao.IKhoiLuaChon | null> => {
		const response = await getPathwayChoice(maKhoaNganh, maKhoiLuaChon);
		return response?.data?.data ?? null;
	};

	// Lấy thông tin của pathway đã được sinh viên chọn
	const fetchChosenPathway = async (maKhoaNganh: string, maKhoiLuaChon: string): Promise<void> => {
		try {
			const choiceData = await getChosenPathwayData(maKhoaNganh, maKhoiLuaChon);
			setRegisteredPathway(choiceData);
		} catch (error: any) {
			return Promise.reject(error);
		}
	};

	// Làm mới thông tin pathway đã chọn (refresh)
	const refreshChosenPathway = async (maKhoaNganh: string) => {
		if (maKhoaNganh && currentKhoiLuaChonMa) {
			await fetchChosenPathway(maKhoaNganh, currentKhoiLuaChonMa);
		} else {
			setRegisteredPathway(null);
		}
	};

	// Lấy danh sách khối lựa chọn theo khóa ngành
	const getKhoiLuaChonListData = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.IKhoiKienThuc[]> => {
		const response = await getManyKhoiLuaChonKhoaNganh(maKhoaNganh);
		return response?.data?.data ?? [];
	};

	// Lấy danh sách khối lựa chọn theo khóa ngành
	const fetchKhoiLuaChonList = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.IKhoiKienThuc[]> => {
		setIsLoadingKhoiLuaChon(true);
		try {
			const danhSachKhoiLuaChon = await getKhoiLuaChonListData(maKhoaNganh);
			setKhoiLuaChonList(danhSachKhoiLuaChon);

			if (!currentKhoiLuaChonMa && danhSachKhoiLuaChon.length > 0) {
				setCurrentKhoiLuaChonMa(danhSachKhoiLuaChon[0].ma);
				setCurrentKhoiLuaChonTen(danhSachKhoiLuaChon[0].ten);
			}

			return danhSachKhoiLuaChon;
		} catch (error) {
			setKhoiLuaChonList([]);
			return Promise.reject(error);
		} finally {
			setIsLoadingKhoiLuaChon(false);
		}
	};

	// Xử lý chọn pathway
	const handleSelectPathway = async (
		payload: {
			maKhoaNganh: string;
			maKhoiCha: string;
			maKhoiCon: string;
			dotDangKyPathwayId: string;
		},
		messages: {
			errorIncomplete: string;
			successChoose: string;
			errorChoose: string;
		},
		onSuccess?: () => void,
	) => {
		setFormSubmiting(true);
		try {
			await choosePathwayService(payload);
			message.success(messages.successChoose);
			onSuccess?.();
		} catch (error: any) {
			const errorMessage = error?.response?.data?.message || messages.errorChoose;
			message.error(errorMessage);
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	// Reset tất cả state
	const resetPathwayState = () => {
		setDanhSach([]);
		setRegisteredPathway(null);
		setKhoiLuaChonList([]);
		setCurrentKhoiLuaChonMa('');
		setCurrentKhoiLuaChonTen('');
		setSelectedKhoiLuaChon(null);
	};

	// Khởi tạo dữ liệu pathway cho khóa ngành
	const initializePathwayData = async (maKhoaNganh: string) => {
		if (!maKhoaNganh) {
			resetPathwayState();
			return;
		}

		// Lấy danh sách khối lựa chọn
		await fetchKhoiLuaChonList(maKhoaNganh);
	};

	return {
		...objInit,
		fetchPathwayList,
		getSelectedKhoiLuaChonFromCache,
		fetchChosenPathway,
		refreshChosenPathway,
		fetchKhoiLuaChonList,
		handleSelectPathway,
		initializePathwayData,
		selectedKhoiLuaChon,
		setSelectedKhoiLuaChon,
		currentKhoiLuaChonMa,
		setCurrentKhoiLuaChonMa,
		currentKhoiLuaChonTen,
		khoiLuaChonList,
		setKhoiLuaChonList,
		isLoadingKhoiLuaChon,
		setIsLoadingKhoiLuaChon,
		registeredPathway,
		setRegisteredPathway,
		formSubmiting,
	};
};
