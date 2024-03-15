import useInitModel from '@/hooks/useInitModel';
import { sinhVienDangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<DangKyNhuCau.IHocPhanDangKyNhuCau>(
		'hoc-phan-dk-nhu-cau',
		undefined,
		undefined,
		ipDaoTao,
	);

	const { setFormSubmiting, formSubmiting } = objInit;

	const sinhVienDangKyNhuCauModel = async (
		idDot: string,
		payLoad: DangKyNhuCau.IHocPhanDangKyNhuCau,
		getData?: () => void,
	): Promise<DangKyNhuCau.IHocPhanDangKyNhuCau> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await sinhVienDangKyNhuCau(idDot, payLoad);
			message.success('Đăng ký thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		sinhVienDangKyNhuCauModel,
	};
};
