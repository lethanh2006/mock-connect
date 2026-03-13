import useInitModel from '@/hooks/useInitModel';
import type { XetHocVu } from '@/services/HocTap/XetHocVu/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<XetHocVu.IRecord>('xu-ly-ket-qua-hoc-tap', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
