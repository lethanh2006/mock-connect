import useInitModel from '@/hooks/useInitModel';
import { dongTruocHocPhi, getSoDuViSinhVien, thanhToanFullBill } from '@/services/TaiChinh/GiaoDich';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ipTaiChinh } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<GiaoDich.IRecord>('transaction', undefined, undefined, ipTaiChinh);
	const [soDuVi, setSoDuVi] = useState<number>(0);
	const { setLoading, setFormSubmiting } = objInit;

	const getSoDuViSinhVienModel = async () => {
		setLoading(true);
		try {
			const res = await getSoDuViSinhVien();
			setSoDuVi(res.data?.data ?? 0);
			return res.data?.data ?? 0;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const dongTruocHocPhiModel = async (payLoad: Partial<GiaoDich.TDongTruocHocPhi>): Promise<unknown> => {
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

	const thanhToanFullBillModel = async (payLoad: Partial<GiaoDich.TThanhToan>): Promise<unknown> => {
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

	return {
		...objInit,
		soDuVi,
		getSoDuViSinhVienModel,
		dongTruocHocPhiModel,
		thanhToanFullBillModel,
	};
};
