import { danhGiaGiangVien, getDanhGiaGiangVien } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { message } from 'antd';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const [danhSach, setDanhSach] = useState<BieuMau.IDanhGiaGiangVien[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const getDanhGiaGiangVienModel = async (lopHocPhanId: string): Promise<BieuMau.IDanhGiaGiangVien[]> => {
		setLoading(true);
		try {
			const res = await getDanhGiaGiangVien(lopHocPhanId);

			setDanhSach(_.orderBy(res.data?.data, ['updatedAt'], ['desc']));
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const danhGiaGiangVienModel = async (
		payload: Partial<BieuMau.IDanhGiaGiangVien>,
	): Promise<BieuMau.IDanhGiaGiangVien> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await danhGiaGiangVien(payload);
			message.success('Gửi câu trả lời thành công');

			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		getDanhGiaGiangVienModel,
		danhGiaGiangVienModel,
		danhSach,
		loading,
		formSubmiting,
	};
};
