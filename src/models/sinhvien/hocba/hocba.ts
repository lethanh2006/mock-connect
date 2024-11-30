import useInitModel from '@/hooks/useInitModel';
import type { HocBaSinhVien } from '@/services/DaoTao/HocBa/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocBaSinhVien.IRecord>('hoc-ba-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
