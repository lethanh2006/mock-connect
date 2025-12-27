import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<RolesManagement.IRecord>('roles', undefined, undefined, ipCCT, {
		order: 1,
	});

	return {
		...objInit,
	};
};
