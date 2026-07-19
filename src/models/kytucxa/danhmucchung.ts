import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DanhMucChung.IRecord>('danh-muc-chung', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
