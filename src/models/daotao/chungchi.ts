import useInitModel from '@/hooks/useInitModel';
import type { ChungChi } from '@/services/DaoTao/ChungChi/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChungChi.IRecord>('chung-chi', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
