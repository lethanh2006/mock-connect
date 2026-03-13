import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IPhieuDangKyQuyDoiDiem>(
		'phieu-dang-ky-quy-doi-diem',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
