import { postDangKyXetTotNghiep, putDangKyHoanTotNghiep, putPhanHoiXetTotNghiep } from '@/services/HocTap/XetTotNghiep';
import type { DotXetTotNghiep } from '@/services/HocTap/XetTotNghiep/typing';
import { useState } from 'react';
import { message } from 'antd';

export default () => {
	const [record, setRecord] = useState<DotXetTotNghiep.IRecord>();
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

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

	const hoanXetTotNghiepModel = async (
		sinhVienDotId: string,
		payload: { yKienSinhVien?: string },
	): Promise<DotXetTotNghiep.ISinhVienDot> => {
		setFormSubmiting(true);
		try {
			const response = await putDangKyHoanTotNghiep(sinhVienDotId, payload);
			message.success('Đã gửi yêu cầu hoãn xét tốt nghiệp');
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const phanHoiXetTotNghiepModel = async (
		sinhVienDotId: string,
		payload: { yKienSinhVien?: string },
	): Promise<DotXetTotNghiep.ISinhVienDot> => {
		setFormSubmiting(true);
		try {
			const response = await putPhanHoiXetTotNghiep(sinhVienDotId, payload);
			message.success('Đã gửi phản hồi xét tốt nghiệp');
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
		dangKyXetTotNghiepModel,
		hoanXetTotNghiepModel,
		phanHoiXetTotNghiepModel,
	};
};
