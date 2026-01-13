import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ActivitiesTypeDomain.IRecord>('activities-type-domain', undefined, undefined, ipCCT, {
		order: 1,
	});

	return {
		...objInit,
	};
};
