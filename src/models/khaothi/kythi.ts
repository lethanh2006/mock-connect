import useInitModel from '@/hooks/useInitModel';
import type { KyThi } from '@/services/KhaoThi/KyThi/typings';
import { ipKhaoThi } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KyThi.IRecord>('ky-thi', undefined, undefined, ipKhaoThi);

	return {
		...objInit,
	};
};
