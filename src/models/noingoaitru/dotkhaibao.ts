import useInitModel from '@/hooks/useInitModel';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';

export default () => {
	const objInit = useInitModel<NoiNgoaiTru.IRecord>('dot-khai-bao-noi-tru-ngoai-tru');

	return {
		...objInit,
	};
};
