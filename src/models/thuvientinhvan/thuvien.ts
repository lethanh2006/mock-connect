import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<any>(
		'hoc-lieu-de-cuong/thu-vien',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
