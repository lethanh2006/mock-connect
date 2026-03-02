import useInitModel from '@/hooks/useInitModel';
import { registerActivity } from '@/services/CCT/Activity';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Activity.IRecord>('activities', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;

	const registerActivityModel = async (idActivity: string, getData?: () => void): Promise<Activity.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await registerActivity(idActivity);

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
		registerActivityModel,
	};
};
