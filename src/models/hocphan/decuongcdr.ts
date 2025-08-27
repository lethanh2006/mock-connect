import useInitModel from '@/hooks/useInitModel';
import { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhan.IChuanDauRa>('dm-muc-tieu-hoc-phan', undefined, undefined, ipDaoTao, { ma: 1 });

	return {
		...objInit,
	};
};
