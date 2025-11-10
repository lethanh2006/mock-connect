import useInitModel from '@/hooks/useInitModel';
import { huyDonXinNghi } from '@/services/DaoTao/YeuCauNghiHoc';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<YeuCauNghiHoc.IRecord>('dang-ky-nghi-hoc', undefined, undefined, ipDaoTao);
	const { formSubmiting, setFormSubmiting } = objInit;

	const huyDonXinNghiModal = async (idDon: string, getData?: () => void): Promise<YeuCauNghiHoc.IRecord> => {
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

	return {
		...objInit,
		huyDonXinNghiModal,
	};
};
