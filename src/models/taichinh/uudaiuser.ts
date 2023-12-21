import useInitModel from '@/hooks/useInitModel';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<UuDaiThanhToan.IUuDaiUser>('uu-dai-thanh-toan/user', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
