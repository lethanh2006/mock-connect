import useInitModel from '@/hooks/useInitModel';
import { postSinhVienDangKyKham, postSinhVienMienKham, putSinhVienMienKham } from '@/services/KiemTraSucKhoe';
import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { getIntl } from 'umi';

export default () => {
	const objInit = useInitModel<KiemTraSucKhoe.IDotDangKy>('ksk/registration-periods', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const postSinhVienDangKyKhamModel = async (
		payLoad: KiemTraSucKhoe.ISinhVienDangKy,
		getData?: () => void,
	): Promise<KiemTraSucKhoe.ISinhVienDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienDangKyKham(payLoad);

			message.success(getIntl()?.formatMessage({ id: 'global.message.themmoithanhcong' }));
			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postSinhVienMienKhamModel = async (
		payLoad: KiemTraSucKhoe.ISinhVienMienKham,
		getData?: () => void,
	): Promise<KiemTraSucKhoe.ISinhVienMienKham> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienMienKham(payLoad);

			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putSinhVienMienKhamModel = async (
		payLoad: KiemTraSucKhoe.ISinhVienMienKham,
		getData?: () => void,
	): Promise<KiemTraSucKhoe.ISinhVienMienKham> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putSinhVienMienKham(payLoad);

			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postSinhVienDangKyKhamModel,
		postSinhVienMienKhamModel,
		putSinhVienMienKhamModel,
	};
};
