import useInitModel from '@/hooks/useInitModel';
import { Idp } from '@/services/Idp/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	// idp sống trong backend co-curriculum, không phải qldt — dùng chung ip local với các module co-curriculum khác.
	const objInit = useInitModel<Idp.IRecord>('idp', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
