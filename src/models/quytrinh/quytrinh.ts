import useInitModel from '@/hooks/useInitModel';
import type { QuyTrinh } from '@/services/QuyTrinh/typing';

export default () => {
	const objInit = useInitModel<QuyTrinh.IRecord>('quy-trinh-dong/user');

	return {
		...objInit,
	};
};
