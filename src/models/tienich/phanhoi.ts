import useInitModel from '@/hooks/useInitModel';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';

export default () => {
	const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', undefined, undefined, undefined, {
		createdAt: -1,
	});

	return {
		...objInit,
	};
};
