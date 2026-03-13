import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Competency.ICompetencyAttributes>('competency-attributes', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
