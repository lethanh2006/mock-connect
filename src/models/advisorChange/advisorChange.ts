import useInitModel from '@/hooks/useInitModel';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<AdvisorChange.IRecord>('student/me', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
