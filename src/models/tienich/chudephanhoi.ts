import useInitModel from '@/hooks/useInitModel';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';

export default () => {
	const objInit = useInitModel<PhanHoi.IChuDePhanHoi>('linh-vuc-phan-hoi');

	return {
		...objInit,
	};
};
