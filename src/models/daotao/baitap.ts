import useInitModel from '@/hooks/useInitModel';
import { sinhVienNopBai } from '@/services/DaoTao/BaiTap';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<BaiTap.IDanhSachGiaoBaiTap>('assignment-user', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting } = objInit;

	const sinhVienNopBaiTapModal = async (
		payLoad: {
			mode: 'submit' | 'save';
			thongTinCauTraLoiQuiz: object;
			assignmentId: string;
			noiDungTraLoi: string;
			urlImages: string[] | null;
		},
		getData?: () => void,
	): Promise<BaiTap.IDanhSachGiaoBaiTap> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await sinhVienNopBai(payLoad);
			message.success('Lưu thành công');

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
		sinhVienNopBaiTapModal,
	};
};
