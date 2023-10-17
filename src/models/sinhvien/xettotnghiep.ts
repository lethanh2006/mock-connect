import { getDotHienHanh, postDangKyXetTotNghiep, putYKienXetTotNghiep } from '@/services/HocTap/XetTotNghiep';
import type { DotXetTotNghiep } from '@/services/HocTap/XetTotNghiep/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const [record, setRecord] = useState<DotXetTotNghiep.IDotHienHanh>();
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const getDotHienHanhModel = async (): Promise<DotXetTotNghiep.IDotHienHanh> => {
		setLoading(true);
		try {
			const response = await getDotHienHanh();
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const dangKyXetTotNghiepModel = async (dotXetTotNghiepId: string): Promise<DotXetTotNghiep.IRecord> => {
		setFormSubmiting(true);
		try {
			const response = await postDangKyXetTotNghiep(dotXetTotNghiepId);
			setRecord(response?.data?.data ?? null);
			message.success('Đã gửi yêu cầu đăng ký xét tốt nghiệp');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const yKienXetTotNghiepModel = async (
		sinhVienDotId: string,
		type: 'phan-hoi' | 'hoan',
		payload: { yKienSinhVien?: string },
	): Promise<DotXetTotNghiep.ISinhVienDot> => {
		setFormSubmiting(true);
		try {
			const response = await putYKienXetTotNghiep(sinhVienDotId, type, payload);
			message.success(`Đã gửi ${type === 'hoan' ? 'yêu cầu hoãn' : 'phản hồi'} xét tốt nghiệp`);
			setVisibleForm(false);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		record,
		setRecord,
		formSubmiting,
		setFormSubmiting,
		visibleForm,
		setVisibleForm,
		dangKyXetTotNghiepModel,
		yKienXetTotNghiepModel,
		getDotHienHanhModel,
	};
};
