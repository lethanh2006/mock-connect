import useInitModel from '@/hooks/useInitModel';
import { getDotHienHanh, sinhVienDangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh';
import type { DangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DangKyChuyenNganh.ISinhVienDangKy>(
		'dang-ky-chuyen-nganh/sinh-vien',
		undefined,
		undefined,
		ipDaoTao,
	);
	const [dotHienHanh, setDotHienHanh] = useState<DangKyChuyenNganh.IDotDangKy>();
	const { setFormSubmiting, formSubmiting, setLoading } = objInit;

	const getDotHienHanhModel = async (): Promise<DangKyChuyenNganh.IDotDangKy> => {
		setLoading(true);
		try {
			const res = await getDotHienHanh();
			setDotHienHanh(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const postDangKyModel = async (data: DangKyChuyenNganh.TDangKy, getData?: () => void) => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await sinhVienDangKyChuyenNganh(data);
			message.success('Cập nhật thành công');
			if (getData) getData();
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		dotHienHanh,
		setDotHienHanh,
		getDotHienHanhModel,
		postDangKyModel,
	};
};
