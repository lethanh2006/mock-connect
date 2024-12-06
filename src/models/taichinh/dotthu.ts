import useInitModel from '@/hooks/useInitModel';
import type { DotThuTaiChinh } from '@/services/TaiChinh/DotThu/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotThuTaiChinh.IRecord>('dot-thu', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
