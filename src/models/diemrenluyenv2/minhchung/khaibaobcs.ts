import useInitModel from '@/hooks/useInitModel';
import type { KhaiBaoDRL } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/typing';

export default () => {
	const objInit = useInitModel<KhaiBaoDRL.IRecord>('khai-bao-minh-chung/ban-can-su');

	return {
		...objInit,
	};
};
