import useInitModel from '@/hooks/useInitModel';
import type { DangKyHocDuThinh } from '@/services/DaoTao/DkDuThinh/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	return useInitModel<DangKyHocDuThinh.IRecord>('dang-ky-hoc-du-thinh', undefined, undefined, ipDaoTao);
};
