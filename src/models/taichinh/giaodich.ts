import useInitModel from '@/hooks/useInitModel';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<GiaoDich.IRecord>('transaction', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
