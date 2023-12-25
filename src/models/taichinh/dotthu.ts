import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotThuTaiChinh.Record>('dot-thu', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
