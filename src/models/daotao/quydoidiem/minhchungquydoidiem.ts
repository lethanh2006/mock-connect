import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IMinhChungQuyDoiDiem>(
		'quy-doi-diem-sv-minh-chung',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
