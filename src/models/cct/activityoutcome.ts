import useInitModel from '@/hooks/useInitModel';
import { deleteActivity, postActivityOutCome } from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const postActivityOutComeModel = async (
		idActivity: string,
		payLoad: {
			rolesId: string;
			answerId: string | null;
		},
		getData?: () => void,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postActivityOutCome(idActivity, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteActivityModel = async (idActivity: string, getData?: () => void): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await deleteActivity(idActivity);
			message.success('Lưu thành công');

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
		postActivityOutComeModel,
		deleteActivityModel,
	};
};
