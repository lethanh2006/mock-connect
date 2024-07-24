import useInitModel from '@/hooks/useInitModel';
import type { XemSau } from '@/services/XemSau/typing';

export default () => {
	const objInit = useInitModel<XemSau.IRecord>('xem-sau');
	return {
		...objInit,
	};
};
