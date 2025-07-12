import useInitModel from '@/hooks/useInitModel';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DangKyNhuCau.IDotDangKyKhoaNganh>(
		'dot-dang-ky-nhu-cau-khoa-nganh',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
