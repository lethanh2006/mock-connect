import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocKy.IRecord>('hoc-ky', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
