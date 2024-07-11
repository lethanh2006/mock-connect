import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotThuTruocHocPhi.IRecord>('dot-thu-truoc-hoc-phi', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
