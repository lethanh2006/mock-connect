import useInitModel from '@/hooks/useInitModel';
import { ETrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import { huyDonXinNghi } from '@/services/DaoTao/YeuCauNghiHoc';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<YeuCauNghiHoc.IRecord>('dang-ky-nghi-hoc', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting, danhSach, getModel: _getModel } = objInit;

	const getModel = (tenLopHocPhan: string) =>
		tenLopHocPhan && _getModel(undefined, undefined, { createdAt: -1 }, 1, 20, `me/${tenLopHocPhan}`);

	const huyDonXinNghiModel = async (idDon: string, getData?: () => void): Promise<YeuCauNghiHoc.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await huyDonXinNghi(idDon);
			message.success('Hủy thành công');

			if (getData) getData();
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const daXinNghiHoc = (thoiKhoaBieuId: string) => {
		return danhSach?.some(
			(i) => i.thoiKhoaBieuId === thoiKhoaBieuId && i.trangThai && i.trangThai !== ETrangThaiDonNghiHoc.DA_HUY,
		);
	};

	return {
		...objInit,
		getModel,
		huyDonXinNghiModel,
		daXinNghiHoc,
	};
};
