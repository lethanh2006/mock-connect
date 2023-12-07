import useInitModel from '@/hooks/useInitModel';
import { dongTruocHocPhi, getSoDuViSinhVien } from '@/services/TaiChinh/GiaoDich';
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

	const dongTruocHocPhiModel = async (
		payLoad: Partial<GiaoDich.TDongTruocHocPhi>,
	): Promise<GiaoDich.TDongTruocHocPhi> => {
		setFormSubmiting(true);
		try {
			const response = await dongTruocHocPhi(payLoad);
			message.success('Đóng học phí thành công');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getSoDuViSinhVienModel,
		soDuVi,
		dongTruocHocPhiModel,
	};
};
