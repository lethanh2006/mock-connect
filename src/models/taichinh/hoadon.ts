import useInitModel from '@/hooks/useInitModel';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HoaDon.IRecord>('bill', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
