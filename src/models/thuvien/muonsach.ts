import useInitModel from '@/hooks/useInitModel';
import {
	chinhSuaMuonTraMe,
	dangKyAnPham,
	getSetting,
	thongKeMuonTraSach,
	xoaMuonTraMe,
} from '@/services/QuanLyThuVien/MuonSach';
import type { MuonSach } from '@/services/QuanLyThuVien/MuonSach/typing';
import { ipThuVien } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MuonSach.IRecord>('thue-muon-an-pham', undefined, undefined, ipThuVien);
	const { setFormSubmiting, formSubmiting, setLoading } = objInit;
	const [settingMuonTra, setSettingMuonTra] = useState<MuonSach.TSetting>();
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<MuonSach.IThongKe>();
	const [visibleMuon, setVisibleMuon] = useState<boolean>(false);

	const getSettingModel = async (): Promise<MuonSach.TSetting> => {
		setLoading(true);
		try {
			const res = await getSetting();
			setSettingMuonTra(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const dangKyAnPhamModel = async (payLoad: { anPhamId: string }, getData?: () => void): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await dangKyAnPham(payLoad);
			message.success('Mượn thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const thongKeMuonTraSachModel = async (): Promise<MuonSach.IThongKe> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeMuonTraSach();
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const chinhSuaMuonTraMeModel = async (
		id: string,
		payLoad: MuonSach.IRecord,
		getData?: () => void,
	): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await chinhSuaMuonTraMe(id, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const xoaMuonTraMeModel = async (id: string, getData?: () => void): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await xoaMuonTraMe(id);
			message.success('Lưu thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		visibleMuon,
		setVisibleMuon,
		loadingThongKe,
		settingMuonTra,
		dataThongKe,
		dangKyAnPhamModel,
		getSettingModel,
		thongKeMuonTraSachModel,
		chinhSuaMuonTraMeModel,
		xoaMuonTraMeModel,
	};
};
