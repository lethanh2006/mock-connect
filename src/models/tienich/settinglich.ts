import useInitModel from '@/hooks/useInitModel';
import type { SettingLich } from '@/services/TienIch/SettingLich/typing';

export default () => {
	const objInit = useInitModel<SettingLich.IRecord>('setting-lich');
	const { getModel, setRecord } = objInit;

	const getSettingLich = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me')?.then((rec) => setRecord(rec[0]));
	};

	return {
		...objInit,
		getSettingLich,
	};
};
