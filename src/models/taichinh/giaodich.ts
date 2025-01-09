import useInitModel from '@/hooks/useInitModel';
import {
	dongTruocHocPhi,
	getConfigMomo,
	getSoDuViSinhVien,
	getTongGiaoDichSinhVien,
	huyThanhToanGiaoDich,
	postThongTinMomo,
	thanhToanFullBill,
} from '@/services/TaiChinh/GiaoDich';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { ipTaiChinh } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<GiaoDich.IRecord>('transaction', undefined, undefined, ipTaiChinh);
	const [soDuVi, setSoDuVi] = useState<number>(0);
	const [tongGiaoDich, setTongGiaoDich] = useState<GiaoDich.TUserWallet>();
	const [visibleHuongDan, setVisibleHuongDan] = useState<boolean>(false);
	const [paymentType, setPaymentType] = useState<ETransactionPaymentType>(ETransactionPaymentType.BANK);
	const [momoConfig, setMomoConfig] = useState<GiaoDich.TMomoConfig>();
	const { setLoading, formSubmiting, setFormSubmiting } = objInit;

	const getMomoConfigModel = async (): Promise<GiaoDich.TMomoConfig> => {
		setLoading(true);
		try {
			const res = await getConfigMomo();
			setMomoConfig(res.data?.data);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const thanhToanMomoModel = async (transactionIdentityCode: string): Promise<GiaoDich.TMomoResponse> => {
		if (!transactionIdentityCode) return Promise.reject('Invalid transaction identity code');
		setLoading(true);
		try {
			const res = await postThongTinMomo({
				identityCode: transactionIdentityCode,
				redirectUrl: window.location.origin + window.location.pathname,
			});
			const info: GiaoDich.TMomoResponse = res.data?.data;
			if (info.payUrl) window.location.href = info.payUrl;

			return info;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getSoDuViSinhVienModel = async (idDotThu?: string | null): Promise<number> => {
		setLoading(true);
		try {
			const res = await getSoDuViSinhVien(idDotThu || null);
			setSoDuVi(res.data?.data ?? 0);
			return res.data?.data ?? 0;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const getTongGiaoDichSinhVienModel = async (): Promise<GiaoDich.TUserWallet> => {
		setLoading(true);
		try {
			const res = await getTongGiaoDichSinhVien();
			const temp: GiaoDich.TUserWallet = res.data?.data;

			setTongGiaoDich({ ...temp, totalRemain: (temp.totalIn ?? 0) - (temp.totalOut ?? 0) });
			return { ...temp, totalRemain: (temp.totalIn ?? 0) - (temp.totalOut ?? 0) };
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const dongTruocHocPhiModel = async (payLoad: GiaoDich.TDongTruocHocPhi): Promise<GiaoDich.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const response = await dongTruocHocPhi(payLoad);
			message.success('Tạo lệnh đóng học phí thành công');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const thanhToanFullBillModel = async (
		payLoad: GiaoDich.TThanhToan,
	): Promise<Partial<GiaoDich.TThanhToanResponse>> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const response = await thanhToanFullBill(payLoad);
			message.success('Tạo lệnh thanh toán thành công');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const huyThanhToanModel = async (transactionId: string): Promise<unknown> => {
		setLoading(true);
		try {
			const response = await huyThanhToanGiaoDich(transactionId);
			message.success('Đã hủy giao dịch');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		soDuVi,
		tongGiaoDich,
		momoConfig,
		paymentType,
		setPaymentType,
		visibleHuongDan,
		setVisibleHuongDan,
		getSoDuViSinhVienModel,
		dongTruocHocPhiModel,
		thanhToanFullBillModel,
		getMomoConfigModel,
		thanhToanMomoModel,
		huyThanhToanModel,
		getTongGiaoDichSinhVienModel,
	};
};
