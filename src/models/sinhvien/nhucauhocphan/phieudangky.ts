import useInitModel from '@/hooks/useInitModel';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhanNhuCau.IPhieuDangKy>(
		'sinh-vien-dang-ky-hoc-phan-nhu-cau',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
