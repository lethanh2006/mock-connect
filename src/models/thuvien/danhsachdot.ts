import useInitModel from '@/hooks/useInitModel';
import { nopTaiLieu } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IQuanLyDanhSachNop>('quan-ly-la-lv-kl', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting } = objInit;

	const nopTaiLieuModel = async (
		id: string,
		payLoad: Partial<QuanLyThuVien.IQuanLyDanhSachNop>,
		getData?: () => void,
	): Promise<QuanLyThuVien.IQuanLyDanhSachNop> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await nopTaiLieu(id, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};
	return {
		...objInit,
		nopTaiLieuModel,
	};
};
