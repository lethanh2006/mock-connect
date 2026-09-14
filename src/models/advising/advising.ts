import useInitModel from '@/hooks/useInitModel';
import { Advising } from '@/services/Advising/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	// advising sống trong backend co-curriculum, dùng chung ip với idp/advisorChange.
	const objInit = useInitModel<Advising.IBooking>('advising', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
