import useInitModel from '@/hooks/useInitModel';
import { postSinhVienDangKyTruong, postSinhVienDangKyTuChon, putSinhVienDangKyTuChon } from '@/services/BaoHiemYTe';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaoHiemYTe.IDotDangKy>('bhyt/registration-periods', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const postSinhVienDangKyTruongModel = async (
		payLoad: BaoHiemYTe.ISinhVienDangKyTruong,
		getData?: () => void,
	): Promise<BaoHiemYTe.IDotDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienDangKyTruong(payLoad);

			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postSinhVienDangKyTuChonModel = async (
		payLoad: BaoHiemYTe.ISinhVienDangKy,
		getData?: () => void,
	): Promise<BaoHiemYTe.ISinhVienDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienDangKyTuChon(payLoad);

			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putSinhVienDangKyTuChonModel = async (
		payLoad: BaoHiemYTe.ISinhVienDangKy,
		getData?: () => void,
	): Promise<BaoHiemYTe.ISinhVienDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putSinhVienDangKyTuChon(payLoad);

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
		postSinhVienDangKyTruongModel,
		postSinhVienDangKyTuChonModel,
		putSinhVienDangKyTuChonModel,
	};
};
