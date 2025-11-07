import useInitModel from '@/hooks/useInitModel';
import { sinhVienNopBai, thongKeBaiTap } from '@/services/DaoTao/BaiTap';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<BaiTap.IDanhSachGiaoBaiTap>('assignment-user', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, setLoading, setDanhSach, getModel, setPage, setLimit } = objInit;

	const getBaiTapSinhVienModel = async (
		page?: number,
		limit?: number,
		maHocKy?: string,
	): Promise<BaiTap.IDanhSachGiaoBaiTap[]> => {
		page && setPage(page);
		limit && setLimit(limit);

		const path = `hoc-ky/${maHocKy}/sinh-vien/me/page`;

		const res = await getModel(undefined, undefined, undefined, undefined, undefined, path);

		setDanhSach(res);

		return res;
	};

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

	const thongKeBaiTapModel = async (startDate: any, endDate: any): Promise<BaiTap.IDanhSachGiaoBaiTap[]> => {
		setLoading(true);

		try {
			const res = await thongKeBaiTap(startDate, endDate);
			setDanhSach(res.data?.data ?? []);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		sinhVienNopBaiTapModal,
		thongKeBaiTapModel,
		getBaiTapSinhVienModel,
	};
};
