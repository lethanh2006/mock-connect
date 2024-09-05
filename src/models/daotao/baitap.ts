import useInitModel from '@/hooks/useInitModel';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaiTap.IDanhSachGiaoBaiTap>('assignment-user', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
