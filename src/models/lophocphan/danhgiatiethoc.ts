import { danhGiaTietHoc, getDanhGiaTietHoc } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [record, setRecord] = useState<BieuMau.IDanhGiaTietHoc>();
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const getDanhGiaTietHocModel = async (thoiKhoaBieuId: string): Promise<BieuMau.IDanhGiaTietHoc> => {
		setLoading(true);
		try {
			const res = await getDanhGiaTietHoc(thoiKhoaBieuId);
			setRecord(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const danhGiaTietHocModel = async (
		payload: Partial<BieuMau.TPostDanhGiaTietHoc>,
	): Promise<BieuMau.IDanhGiaTietHoc> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await danhGiaTietHoc(payload);
			message.success('Gửi câu trả lời thành công');

			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		getDanhGiaTietHocModel,
		danhGiaTietHocModel,
		record,
		loading,
		formSubmiting,
	};
};
