import useInitModel from '@/hooks/useInitModel';
import { postChungChiSinhVien } from '@/services/DaoTao/SinhVien';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<SinhVien.IChungChiSinhVien>('chung-chi-sv', undefined, undefined, ipDaoTao);
	const { setFormSubmiting, getModel: getOrigin } = objInit;

	const getModel = async (condition?: Partial<SinhVien.IChungChiSinhVien>) =>
		getOrigin(condition, undefined, undefined, undefined, undefined, 'sinh-vien/page');

	const postChungChiSinhVienModel = async (
		payLoad: Partial<SinhVien.IChungChiSinhVien>,
		getData?: () => void,
	): Promise<SinhVien.IChungChiSinhVien> => {
		setFormSubmiting(true);
		try {
			const response = await postChungChiSinhVien(payLoad);
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
		getModel,
		postChungChiSinhVienModel,
	};
};
