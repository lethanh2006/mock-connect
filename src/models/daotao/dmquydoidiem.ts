import useInitModel from '@/hooks/useInitModel';
import { type dmQuyDoiDiem } from '@/services/DaoTao/dmQuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<dmQuyDoiDiem.IRecord>('quy-doi-diem', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
