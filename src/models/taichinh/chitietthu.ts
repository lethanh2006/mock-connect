import useInitModel from '@/hooks/useInitModel';
import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChiTietThu.Record>('chi-tiet-thu', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
