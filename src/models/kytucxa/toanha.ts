import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ToaNha.IRecord>('toa-nha', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
