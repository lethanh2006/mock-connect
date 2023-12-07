import useInitModel from '@/hooks/useInitModel';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<UuDaiThanhToan.IUuDaiUser>('uu-dai-thanh-toan/user', undefined, undefined, ipTaiChinh);
	const { getAllModel } = objInit;

	const getUuDaiByBillModel = (billIdentityCode: string): Promise<UuDaiThanhToan.IUuDaiUser[]> =>
		getAllModel(true, undefined, undefined, undefined, `available/me/bill/${billIdentityCode}/many`);

	return {
		...objInit,
		getUuDaiByBillModel,
	};
};
