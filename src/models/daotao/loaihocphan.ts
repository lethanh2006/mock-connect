import useInitModel from '@/hooks/useInitModel';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhan.ILoaiHocPhan>('loai-hoc-phan', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
