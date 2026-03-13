import type { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import { type TinTuc } from '@/services/TinTuc/typing';

export default () => {
	const objInit = useInitModel<TinTuc.IChuDe>('common-topic');
	const { getAllModel: _getAll, danhSach } = objInit;

	const getAllModel = (
		isSetRecord?: boolean,
		sortParam?: { [k in keyof TinTuc.IChuDe]?: 1 | -1 },
		conditionParam?: Partial<TinTuc.IChuDe>,
		filterParam?: TFilter<TinTuc.IChuDe>[],
		pathParam?: string,
		isSetDanhSach?: boolean,
		selectParams?: string[],
		otherQuery?: Record<string, any>,
	): Promise<TinTuc.IChuDe[]> => {
		if (danhSach.length) return Promise.resolve(danhSach);
		else
			return _getAll(
				isSetRecord,
				sortParam,
				conditionParam,
				filterParam,
				pathParam,
				isSetDanhSach,
				selectParams,
				otherQuery,
			);
	};

	return {
		...objInit,
		getAllModel,
	};
};
