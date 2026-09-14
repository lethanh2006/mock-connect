import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Category.IRecord>('common-category', undefined, undefined, ipCore);
	return {
		...objInit,
	};
};
