import useInitModel from '@/hooks/useInitModel';
import { danhGiaGiangVien } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<BieuMau.IDanhGiaGiangVien>('danh-gia-giang-vien');
	const { setVisibleForm, getAllModel, formSubmiting, setFormSubmiting } = objInit;

	const getDanhGiaGiangVienModel = async (lopHocPhanId?: string) =>
		getAllModel(undefined, undefined, undefined, undefined, `lop-hoc-phan/${lopHocPhanId}`);

	const danhGiaGiangVienModel = async (
		payload: Partial<BieuMau.IDanhGiaGiangVien>,
	): Promise<BieuMau.IDanhGiaGiangVien> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await danhGiaGiangVien(payload);
			message.success('Gửi câu trả lời thành công');
			setVisibleForm(false);
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getDanhGiaGiangVienModel,
		danhGiaGiangVienModel,
	};
};
