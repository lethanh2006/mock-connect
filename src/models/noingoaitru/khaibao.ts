import useInitModel from '@/hooks/useInitModel';
import { khaiBaoNoiNgoaiTru } from '@/services/NoiNgoaiTru';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<NoiNgoaiTru.IKhaiBao>('khai-bao-noi-tru-ngoai-tru');
	const { setFormSubmiting, setVisibleForm } = objInit;

	const khaiBaoNoiNgoaiTruModel = async (dotKhaiBaoId: string, payLoad: any): Promise<NoiNgoaiTru.IKhaiBao> => {
		setFormSubmiting(true);
		try {
			const response = await khaiBaoNoiNgoaiTru(dotKhaiBaoId, payLoad);
			message.success('Khai báo thành công');
			setVisibleForm(false);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};
	return {
		...objInit,
		khaiBaoNoiNgoaiTruModel,
	};
};
