import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LevelsManagement.IRecord>('Levels', undefined, undefined, ipCCT, {
		order: 1,
	});

	return {
		...objInit,
	};
};
