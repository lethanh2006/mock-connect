import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.DotQuyDoiDiem>('dot-quy-doi-diem-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
