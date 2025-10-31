import useInitModel from '@/hooks/useInitModel';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<YeuCauNghiHoc.IRecord>('dang-ky-nghi-hoc', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
