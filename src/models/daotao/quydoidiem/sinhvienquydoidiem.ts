import useInitModel from '@/hooks/useInitModel';
import { postSinhVienQuyDoi } from '@/services/HocTap/QuyDoiDiem';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IQuyDoiDiemSinhVien>(
		'quy-doi-diem-sinh-vien',
		undefined,
		undefined,
		ipDaoTao,
	);
	const { formSubmiting, setFormSubmiting } = objInit;

	const postSinhVienQuyDoiModel = async (idDotQuyDoi: string, payLoad: any): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postSinhVienQuyDoi(idDotQuyDoi, payLoad);
			message.success('Thêm thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postSinhVienQuyDoiModel,
	};
};
