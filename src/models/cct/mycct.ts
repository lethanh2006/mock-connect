import useInitModel from '@/hooks/useInitModel';
import { submitMyCCT, updateMyCCT } from '@/services/CCT/MyCCT';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<MyCCT.IRecord>('my-cct', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const updateMyCCTModel = async (
		payLoad: {
			avatar: string;
			selfAspiration: string;
			listCompetency: string[];
			listAwardRecognition: string[];
			selectedActivities: {
				attributeId: string;
				activityIds: string[];
			}[];
		},
		getData?: () => void,
		messageText?: string,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await updateMyCCT(payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const submitMyCCTModel = async (getData?: () => void, messageText?: string): Promise<MyCCT.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await submitMyCCT();
			message.success(messageText ?? 'Gửi thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		updateMyCCTModel,
		submitMyCCTModel,
	};
};
