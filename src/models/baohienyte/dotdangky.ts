import useInitModel from '@/hooks/useInitModel';
import { postSinhVienDangKyTruong, postSinhVienDangKyTuChon } from '@/services/BaoHiemYTe';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaoHiemYTe.IDotDangKy>('bhyt/registration-periods', undefined, undefined, ipCsvc);
	const { formSubmiting, setFormSubmiting } = objInit;

	const postSinhVienDangKyTruongModel = async (idDot: string, getData?: () => void): Promise<BaoHiemYTe.IDotDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienDangKyTruong(idDot);

			if (getData) getData();
			return res.data.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const postSinhVienDangKyTuChonModel = async (
		periodStudentId: string,
		payLoad: BaoHiemYTe.ISinhVienDangKy,
		getData?: () => void,
	): Promise<BaoHiemYTe.ISinhVienDangKy> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postSinhVienDangKyTuChon(periodStudentId, payLoad);

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
	};
};
