import useInitModel from '@/hooks/useInitModel';
import { nhucauhocphan } from '@/services/HocTap/HocPhanNhuCau';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<HocPhanNhuCau.IRecord>(
		'hoc-phan-sinh-vien-dang-ky-nhu-cau',
		undefined,
		undefined,
		ipDaoTao,
	);
	const { setFormSubmiting } = objInit;

	const dangKyHocPhanNhuCauNModel = async (
		payload: {
			maKhoaNganh?: string;
			dotDangKyHocPhanNhuCauId?: string;
			danhSachHocPhan?: string[];
		},
		getData?: () => void,
	): Promise<HocPhanNhuCau.IRecord> => {
		setFormSubmiting(true);
		try {
			const response = await nhucauhocphan(payload);
			message.success('Đăng ký thành công');
			if (getData) getData();
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		dangKyHocPhanNhuCauNModel,
	};
};
