import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SubmisstionRound.IRecord>('cct-submission-round', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
