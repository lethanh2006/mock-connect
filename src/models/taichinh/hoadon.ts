import useInitModel from '@/hooks/useInitModel';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HoaDon.IRecord>('bill', undefined, undefined, ipTaiChinh);
	const { getModel: getModelOrigin } = objInit;

	const getModel = async (
		condition?: Partial<HoaDon.IRecord>,
		filters?: any,
		limit?: number,
	): Promise<HoaDon.IRecord[]> => getModelOrigin(condition, filters, undefined, undefined, limit, 'me/pageable');

	return {
		...objInit,
		getModel,
	};
};
