import useInitModel from '@/hooks/useInitModel';
import { postYeuCauRutTien } from '@/services/TaiChinh/Vi';
import type { Vi } from '@/services/TaiChinh/Vi/typing';
import { ipTaiChinh } from '@/utils/ip';
import { message } from 'antd';
import { getIntl } from 'umi';

export default () => {
	const objInit = useInitModel<Vi.IYeuCauRutTien>('yeu-cau-rut-tien', undefined, undefined, ipTaiChinh, {
		createdAt: -1,
	});
	const { formSubmiting, setFormSubmiting, getAllModel } = objInit;

	/** `GET /yeu-cau-rut-tien/me` trả về toàn bộ đơn của sinh viên đang đăng nhập (không phân trang) */
	const getDanhSachCuaToiModel = () => getAllModel(false, undefined, undefined, undefined, 'me');

	const postYeuCauRutTienModel = async (payload: Vi.TYeuCauRutTienPayload): Promise<Vi.IYeuCauRutTien> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await postYeuCauRutTien(payload);
			message.success(getIntl()?.formatMessage({ id: 'visinhvien.ruttien.message.success' }));
			return res?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getDanhSachCuaToiModel,
		postYeuCauRutTienModel,
	};
};
