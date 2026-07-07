import useInitModel from '@/hooks/useInitModel';
import { sinhVienDangKyKTX } from '@/services/KyTucXa/PhieuDangKy';
import { ipCsvc } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<PhieuDangKyKTX.IRecord>('dang-ky-ky-tuc-xa', undefined, undefined, ipCsvc);
	const { formSubmiting, setFormSubmiting } = objInit;

	const sinhVienDangKyKTXModel = async (
		payLoad: {
			maDotId: string;
			maPhong: string;
			form: PhieuDangKyKTX.IRecord;
		},
		getData?: () => void,
	): Promise<PhieuDangKyKTX.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const response = await sinhVienDangKyKTX(payLoad);
			message.success('Lưu thành công');

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
		sinhVienDangKyKTXModel,
	};
};
